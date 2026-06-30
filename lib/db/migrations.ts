import type { AppDatabase } from './client';
import { LATEST_SCHEMA_VERSION, SCHEMA_SQL } from './schema';
import { runSeeds } from './seeds';
import { seedDefaultRecipeCategories } from './seeds/recipe-categories';

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

  if (currentVersion < 7) {
    // ponytail: destructive rebuild — pre-release, no data to preserve. v7 moves to the
    // multi-brand model: products lose marketId, and price history moves to offers via the
    // new product_offers + product_offer_prices tables (recipe_products gains offerId).
    // product_prices and the shopping/pantry tables are kept; we drop + recreate them so
    // the rebuilt products table satisfies their foreign keys.
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS product_offer_prices;
      DROP TABLE IF EXISTS product_offers;
      DROP TABLE IF EXISTS pantry_transactions;
      DROP TABLE IF EXISTS pantry_items;
      DROP TABLE IF EXISTS shopping_list_items;
      DROP TABLE IF EXISTS product_prices;
      DROP TABLE IF EXISTS recipe_products;
      DROP TABLE IF EXISTS products;
      PRAGMA foreign_keys = ON;
    `);
    await db.execAsync(SCHEMA_SQL);
  }

  if (currentVersion < 8) {
    // ponytail: destructive rebuild — pre-release, no data to preserve. v8 moves rating,
    // imagePath and description (the old products.notes) off products and onto product_offers,
    // since they describe a product at a specific market. Same drop set as v7 so the rebuilt
    // products table satisfies its dependents' foreign keys.
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS product_offer_prices;
      DROP TABLE IF EXISTS product_offers;
      DROP TABLE IF EXISTS pantry_transactions;
      DROP TABLE IF EXISTS pantry_items;
      DROP TABLE IF EXISTS shopping_list_items;
      DROP TABLE IF EXISTS product_prices;
      DROP TABLE IF EXISTS recipe_products;
      DROP TABLE IF EXISTS products;
      PRAGMA foreign_keys = ON;
    `);
    await db.execAsync(SCHEMA_SQL);
  }

  if (currentVersion < 9) {
    // Additive (not a destructive rebuild): recipe_categories is a brand-new table with no
    // dependents, and recipes gains two nullable columns. ON DELETE SET NULL makes deleting a
    // category leave its recipes uncategorized with no app code. Seeded here (not in runSeeds)
    // so the defaults land once for both fresh installs (version 0) and existing v8 dev DBs.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS recipe_categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT,
        description TEXT,
        sortOrder INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    await addColumnIfMissing(
      db,
      'recipes',
      'recipeCategoryId',
      'TEXT REFERENCES recipe_categories(id) ON DELETE SET NULL',
    );
    await addColumnIfMissing(db, 'recipes', 'isFavorite', 'INTEGER NOT NULL DEFAULT 0');
    await seedDefaultRecipeCategories(db);
  }

  if (currentVersion < 10) {
    // Additive + backfill: collapse per-offer price history to a single current price stored
    // on the offer. Add the four price columns, copy each offer's latest product_offer_prices
    // row onto it, then drop the table. Guarded on the table existing so fresh installs (which
    // already get the columns from SCHEMA_SQL and never had the table) skip the backfill.
    await addColumnIfMissing(db, 'product_offers', 'price', 'REAL');
    await addColumnIfMissing(db, 'product_offers', 'normalizedPrice', 'REAL');
    await addColumnIfMissing(db, 'product_offers', 'normalizedUnit', 'TEXT');
    await addColumnIfMissing(db, 'product_offers', 'observedAt', 'TEXT');

    const oldTable = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(product_offer_prices)`);
    if (oldTable.length > 0) {
      await db.execAsync(`
        UPDATE product_offers SET
          price = (SELECT price FROM product_offer_prices pp
                   WHERE pp.offerId = product_offers.id ORDER BY pp.observedAt DESC, pp.id DESC LIMIT 1),
          normalizedPrice = (SELECT normalizedPrice FROM product_offer_prices pp
                   WHERE pp.offerId = product_offers.id ORDER BY pp.observedAt DESC, pp.id DESC LIMIT 1),
          normalizedUnit = (SELECT normalizedUnit FROM product_offer_prices pp
                   WHERE pp.offerId = product_offers.id ORDER BY pp.observedAt DESC, pp.id DESC LIMIT 1),
          observedAt = (SELECT observedAt FROM product_offer_prices pp
                   WHERE pp.offerId = product_offers.id ORDER BY pp.observedAt DESC, pp.id DESC LIMIT 1);
        DROP TABLE product_offer_prices;
      `);
    }
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
