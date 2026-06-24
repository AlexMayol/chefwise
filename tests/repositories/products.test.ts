import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createProductRepository, type ProductListItem } from '@/lib/db/repositories/products';

type EnrichedRow = Omit<ProductListItem, 'isFavorite'> & { isFavorite: number };

function createDb(rows: EnrichedRow[] = []): AppDatabase & { lastGetAllSql?: string } {
  const db: AppDatabase & { lastGetAllSql?: string } = {
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async () => null,
    getAllAsync: async <T,>(sql: string, _params?: SqlParameter[] | Record<string, SqlParameter>) => {
      db.lastGetAllSql = sql;
      return rows as T[];
    },
    runAsync: async () => ({ changes: 1 }),
    withTransactionAsync: async <T,>(work: () => Promise<T>) => work(),
  };

  return db;
}

describe('product repository list enrichment', () => {
  it('joins market name and latest normalized price with prefixed filter columns', async () => {
    const db = createDb();
    const repository = createProductRepository(db);

    await repository.list({ favoritesOnly: true, minRating: 3, sort: 'favorites_first' });

    expect(db.lastGetAllSql).toContain('LEFT JOIN markets');
    expect(db.lastGetAllSql).toContain('product_prices');
    expect(db.lastGetAllSql).toContain('p.isFavorite = 1');
    expect(db.lastGetAllSql).toContain('p.rating >= ?');
    expect(db.lastGetAllSql).toContain('p.isFavorite DESC');
  });

  it('maps enriched rows into product list items with a boolean favorite flag', async () => {
    const db = createDb([
      {
        id: 'product_1',
        name: 'Flour',
        categoryId: null,
        marketId: 'market_1',
        defaultUnit: 'kg',
        rating: 4,
        notes: null,
        isFavorite: 1,
        imagePath: null,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        marketName: 'Corner Market',
        price: 5,
        normalizedPrice: 2.5,
        normalizedUnit: 'kg',
      },
    ]);
    const repository = createProductRepository(db);

    const [item] = await repository.list();

    expect(item.marketName).toBe('Corner Market');
    expect(item.normalizedPrice).toBe(2.5);
    expect(item.normalizedUnit).toBe('kg');
    expect(item.isFavorite).toBe(true);
  });
});
