import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createProductPriceRepository, type ProductPrice } from '@/lib/db/repositories/product-prices';

function createDb(rows: ProductPrice[] = []): AppDatabase & {
  insertedRows: ProductPrice[];
  lastGetFirstSql?: string;
  lastGetFirstParams?: SqlParameter[] | Record<string, SqlParameter>;
} {
  const db: AppDatabase & {
    insertedRows: ProductPrice[];
    lastGetFirstSql?: string;
    lastGetFirstParams?: SqlParameter[] | Record<string, SqlParameter>;
  } = {
    insertedRows: rows,
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async <T,>(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      db.lastGetFirstSql = sql;
      db.lastGetFirstParams = params;
      return rows[0] as T | null;
    },
    getAllAsync: async <T,>() => rows as T[],
    runAsync: async (sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      const columns = sql.match(/\(([^)]+)\)/)?.[1].split(', ').map((column) => column.trim()) ?? [];
      const values = Array.isArray(params) ? params : [];
      const row = Object.fromEntries(columns.map((column, index) => [column, values[index]])) as ProductPrice;
      db.insertedRows.push(row);
      return { changes: 1 };
    },
    withTransactionAsync: async <T,>(work: () => Promise<T>) => work(),
    serializeAsync: async () => new Uint8Array(),
  };

  return db;
}

describe('product price repository', () => {
  it('creates immutable price history rows for the same product', async () => {
    const db = createDb();
    const repository = createProductPriceRepository(db);

    await repository.create({ productId: 'flour', price: 2, quantity: 1, unit: 'kg', observedAt: '2026-01-01' });
    await repository.create({ productId: 'flour', price: 3, quantity: 1, unit: 'kg', observedAt: '2026-01-02' });

    expect(db.insertedRows).toHaveLength(2);
    expect(db.insertedRows.map((row) => row.price)).toEqual([2, 3]);
    expect(db.insertedRows.every((row) => row.productId === 'flour')).toBe(true);
  });

  it('looks up latest prices by observed date and id tie-break', async () => {
    const db = createDb();
    const repository = createProductPriceRepository(db);

    await repository.latestForProduct('flour');

    expect(db.lastGetFirstSql).toContain('WHERE productId = ?');
    expect(db.lastGetFirstSql).toContain('ORDER BY observedAt DESC, id DESC LIMIT 1');
    expect(db.lastGetFirstParams).toEqual(['flour']);
  });
});
