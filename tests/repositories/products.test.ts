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
    serializeAsync: async () => new Uint8Array(),
  };

  return db;
}

describe('product repository list enrichment', () => {
  it('summarizes offers (cheapest price + market count) with prefixed filter columns', async () => {
    const db = createDb();
    const repository = createProductRepository(db);

    await repository.list({ favoritesOnly: true, sort: 'favorites_first' });

    expect(db.lastGetAllSql).toContain('product_offers');
    expect(db.lastGetAllSql).toContain('product_offer_prices');
    expect(db.lastGetAllSql).toContain('MIN(lp.normalizedPrice)');
    expect(db.lastGetAllSql).toContain('COUNT(DISTINCT off.marketId)');
    expect(db.lastGetAllSql).toContain('bestImagePath');
    // bestImagePath comes from the top-rated offer that actually has an image.
    expect(db.lastGetAllSql).toMatch(/imagePath IS NOT NULL[\s\S]*ORDER BY[\s\S]*rating DESC[\s\S]*createdAt DESC/);
    expect(db.lastGetAllSql).not.toContain('LEFT JOIN markets');
    expect(db.lastGetAllSql).toContain('p.isFavorite = 1');
    expect(db.lastGetAllSql).not.toContain('p.rating');
    expect(db.lastGetAllSql).toContain('p.isFavorite DESC');
  });

  it('maps enriched rows into product list items with a boolean favorite flag', async () => {
    const db = createDb([
      {
        id: 'product_1',
        name: 'Flour',
        categoryId: null,
        defaultUnit: 'kg',
        isFavorite: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        offerCount: 2,
        marketCount: 2,
        bestNormalizedPrice: 2.5,
        bestNormalizedUnit: 'kg',
        bestImagePath: null,
      },
    ]);
    const repository = createProductRepository(db);

    const [item] = await repository.list();

    expect(item.offerCount).toBe(2);
    expect(item.marketCount).toBe(2);
    expect(item.bestNormalizedPrice).toBe(2.5);
    expect(item.bestNormalizedUnit).toBe('kg');
    expect(item.isFavorite).toBe(true);
  });
});
