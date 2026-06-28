import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createProductOfferRepository } from '@/lib/db/repositories/product-offers';

function createDb(): AppDatabase & { lastGetAllSql?: string; lastGetAllParams?: SqlParameter[] | Record<string, SqlParameter>; inserted: Record<string, SqlParameter>[] } {
  const inserted: Record<string, SqlParameter>[] = [];
  const db: AppDatabase & { lastGetAllSql?: string; lastGetAllParams?: SqlParameter[] | Record<string, SqlParameter>; inserted: Record<string, SqlParameter>[] } = {
    inserted,
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async () => null,
    getAllAsync: async <T,>(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      db.lastGetAllSql = sql;
      db.lastGetAllParams = params;
      return [] as T[];
    },
    runAsync: async (sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      const columns = sql.match(/\(([^)]+)\)/)?.[1].split(', ').map((column) => column.trim()) ?? [];
      const values = Array.isArray(params) ? params : [];
      inserted.push(Object.fromEntries(columns.map((column, index) => [column, values[index]])));
      return { changes: 1 };
    },
    withTransactionAsync: async <T,>(work: () => Promise<T>) => work(),
    serializeAsync: async () => new Uint8Array(),
  };

  return db;
}

describe('product offer repository', () => {
  it('defaults brand to null when omitted', async () => {
    const repository = createProductOfferRepository(createDb());

    const offer = await repository.create({ productId: 'p1', marketId: 'm1', quantity: 1, unit: 'kg' });

    expect(offer.brand).toBeNull();
    expect(offer.productId).toBe('p1');
    expect(offer.marketId).toBe('m1');
    expect(offer.id.startsWith('offer-')).toBe(true);
    // The per-offer fields default to null when omitted.
    expect(offer.rating).toBeNull();
    expect(offer.imagePath).toBeNull();
    expect(offer.description).toBeNull();
  });

  it('persists the per-offer rating, image and description', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    const offer = await repository.create({
      productId: 'p1',
      marketId: 'm1',
      quantity: 1,
      unit: 'kg',
      rating: 4,
      imagePath: 'images/offers/o1.jpg',
      description: 'Organic, vine-ripened',
    });

    expect(offer.rating).toBe(4);
    expect(offer.imagePath).toBe('images/offers/o1.jpg');
    expect(offer.description).toBe('Organic, vine-ripened');
    expect(db.inserted[0]).toMatchObject({ rating: 4, imagePath: 'images/offers/o1.jpg', description: 'Organic, vine-ripened' });
  });

  it('lists a product\'s offers with their latest price, cheapest first', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listForProduct('p1');

    expect(db.lastGetAllSql).toContain('WHERE off.productId = ?');
    expect(db.lastGetAllSql).toContain('product_offer_prices');
    expect(db.lastGetAllSql).toContain('ORDER BY lp.normalizedPrice');
    expect(db.lastGetAllParams).toEqual(['p1']);
  });

  it('lists a market\'s offers joined with the product name', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listForMarket('m1');

    expect(db.lastGetAllSql).toContain('WHERE off.marketId = ?');
    expect(db.lastGetAllSql).toContain('LEFT JOIN products');
    expect(db.lastGetAllParams).toEqual(['m1']);
  });

  it('lists every offer across markets without a market filter', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listAll();

    expect(db.lastGetAllSql).toContain('FROM product_offers off');
    expect(db.lastGetAllSql).not.toContain('WHERE off.marketId');
    expect(db.lastGetAllParams).toBeUndefined();
  });

  it('lists price events for a category, newest first', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listPriceEventsForCategory('category-1');

    expect(db.lastGetAllSql).toContain('FROM product_offer_prices pp');
    expect(db.lastGetAllSql).toContain('WHERE p.categoryId = ?');
    expect(db.lastGetAllSql).toContain('ORDER BY pp.observedAt DESC');
    expect(db.lastGetAllParams).toEqual(['category-1']);
  });
});
