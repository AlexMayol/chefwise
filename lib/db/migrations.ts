import type { AppDatabase } from './client';
import { LATEST_SCHEMA_VERSION, SCHEMA_SQL } from './schema';
import { runSeeds } from './seeds';

type UserVersionRow = {
  user_version: number;
};

async function getUserVersion(db: AppDatabase): Promise<number> {
  const row = await db.getFirstAsync<UserVersionRow>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

async function addColumnIfMissing(db: AppDatabase, table: string, column: string, definition: string): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (!columns.some((c) => c.name === column)) {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export async function runMigrations(db: AppDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON');

  const currentVersion = await getUserVersion(db);

  if (currentVersion < 1) {
    await db.execAsync(SCHEMA_SQL);
  }

  if (currentVersion < 2) {
    // imagePath was added after v1; backfill the column on databases created before it.
    await addColumnIfMissing(db, 'markets', 'imagePath', 'TEXT');
    await addColumnIfMissing(db, 'products', 'imagePath', 'TEXT');
    await addColumnIfMissing(db, 'recipes', 'imagePath', 'TEXT');
  }

  if (currentVersion < 3) {
    // ponytail: destructive rebuild — pre-release, no data to preserve and existing
    // products have no market to backfill. v3 makes a product belong to one market,
    // drops product_prices.marketId, recipe_product_markets, recipes.pricingStrategy,
    // and shopping_list_items.marketId.
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS recipe_product_markets;
      DROP TABLE IF EXISTS shopping_list_items;
      DROP TABLE IF EXISTS product_prices;
      DROP TABLE IF EXISTS recipe_products;
      DROP TABLE IF EXISTS recipes;
      DROP TABLE IF EXISTS products;
      PRAGMA foreign_keys = ON;
    `);
    await db.execAsync(SCHEMA_SQL);
  }

  // v4 added categories.description but some dev DBs were stamped v4 before the
  // column landed; gate on v5 so the add actually runs on them. Idempotent.
  if (currentVersion < 5) {
    await addColumnIfMissing(db, 'categories', 'description', 'TEXT');
  }

  if (currentVersion < 6) {
    // ponytail: destructive rebuild — pre-release, no data to preserve. v6 switches
    // every table that references products from ON DELETE RESTRICT to CASCADE so a
    // product (a core entity) deletes its prices, recipe lines, list items, and pantry
    // rows with it. Drop the child tables and let SCHEMA_SQL recreate them with the new
    // delete rules; products/recipes/markets/categories rows survive.
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS pantry_transactions;
      DROP TABLE IF EXISTS pantry_items;
      DROP TABLE IF EXISTS shopping_list_items;
      DROP TABLE IF EXISTS product_prices;
      DROP TABLE IF EXISTS recipe_products;
      PRAGMA foreign_keys = ON;
    `);
    await db.execAsync(SCHEMA_SQL);
  }

  if (currentVersion < LATEST_SCHEMA_VERSION) {
    await db.execAsync(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION}`);
  }

  // Seed last, after the destructive rebuild blocks above (which drop/recreate the products
  // and child tables). Seeding inside the `< 1` block would insert rows the later blocks wipe.
  if (currentVersion < 1) {
    await runSeeds(db);
  }
}
