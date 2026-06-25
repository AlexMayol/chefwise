import { runMigrations } from '@/lib/db/migrations';
import { LATEST_SCHEMA_VERSION, REQUIRED_INDEXES, REQUIRED_TABLES, SCHEMA_SQL } from '@/lib/db/schema';
import { createProductPriceRepository } from '@/lib/db/repositories/product-prices';
import type { AppDatabase } from '@/lib/db/client';

function createRecordingDb(version = 0): AppDatabase & { statements: string[] } {
  const statements: string[] = [];

  return {
    statements,
    execAsync: jest.fn(async (sql: string) => {
      statements.push(sql);
    }),
    getFirstAsync: async <T,>(sql: string): Promise<T | null> => {
      statements.push(sql);
      return { user_version: version } as T;
    },
    getAllAsync: jest.fn(async () => []),
    runAsync: jest.fn(async () => ({ changes: 1, lastInsertRowId: 1 })),
    withTransactionAsync: jest.fn(async <T>(work: () => Promise<T>) => work()),
    serializeAsync: jest.fn(async () => new Uint8Array()),
  };
}

describe('database migrations', () => {
  it('migrates a fresh database to the latest schema version', async () => {
    const db = createRecordingDb();

    await runMigrations(db);

    const sql = db.statements.join('\n');
    expect(sql).toContain('PRAGMA foreign_keys = ON');
    expect(sql).toContain(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION}`);

    for (const table of REQUIRED_TABLES) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }

    for (const index of REQUIRED_INDEXES) {
      expect(sql).toContain(`CREATE INDEX IF NOT EXISTS ${index}`);
    }

    expect(sql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS idx_pantry_items_product');
  });

  it('seeds default categories on a fresh database', async () => {
    const db = createRecordingDb();

    await runMigrations(db);

    const inserts = (db.runAsync as jest.Mock).mock.calls.filter(([sql]) =>
      String(sql).includes('INSERT INTO categories'),
    );
    expect(inserts.length).toBeGreaterThan(0);
  });

  it('does not seed categories when the database already exists', async () => {
    const db = createRecordingDb(LATEST_SCHEMA_VERSION);

    await runMigrations(db);

    expect(db.runAsync as jest.Mock).not.toHaveBeenCalled();
  });

  it('cascades product deletes to every table that references a product', () => {
    const productRefs = SCHEMA_SQL.match(/REFERENCES products\(id\)[^,\n)]*/g) ?? [];

    // product_prices, recipe_products, shopping_list_items, pantry_items, pantry_transactions
    expect(productRefs.length).toBe(5);
    for (const ref of productRefs) {
      expect(ref).toContain('ON DELETE CASCADE');
    }
  });

  it('does not expose update or delete methods for immutable product prices', () => {
    const repository = createProductPriceRepository(createRecordingDb());

    expect(repository.create).toEqual(expect.any(Function));
    expect((repository as { update?: unknown }).update).toBeUndefined();
    expect((repository as { delete?: unknown }).delete).toBeUndefined();
  });
});
