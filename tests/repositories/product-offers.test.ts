import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createProductOfferRepository } from '@/lib/db/repositories/product-offers';
import { normalizePrice } from '@/lib/domain/pricing';

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
  it('defaults brand and price to null when omitted', async () => {
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
    expect(offer.price).toBeNull();
    expect(offer.normalizedPrice).toBeNull();
    expect(offer.observedAt).toBeNull();
  });

  it('normalizes and stamps the price when created with one', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);
    const expected = normalizePrice({ price: 6, quantity: 500, unit: 'ml' });

    const offer = await repository.create({ productId: 'p1', marketId: 'm1', quantity: 500, unit: 'ml', price: 6 });

    expect(offer.price).toBe(6);
    expect(offer.normalizedPrice).toBe(expected.normalizedPrice);
    expect(offer.normalizedUnit).toBe(expected.normalizedUnit);
    expect(offer.observedAt).toEqual(expect.any(String));
    expect(db.inserted[0]).toMatchObject({
      price: 6,
      normalizedPrice: expected.normalizedPrice,
      normalizedUnit: expected.normalizedUnit,
    });
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

  it('re-derives normalizedPrice and stamps observedAt when the price changes on update', async () => {
    const db = createDb();
    db.getFirstAsync = (async () => ({ quantity: 500, unit: 'ml', price: null })) as AppDatabase['getFirstAsync'];
    let runSql = '';
    let runParams: SqlParameter[] = [];
    db.runAsync = async (sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      runSql = sql;
      runParams = Array.isArray(params) ? params : [];
      return { changes: 1 };
    };
    const repository = createProductOfferRepository(db);
    const expected = normalizePrice({ price: 6, quantity: 500, unit: 'ml' });

    await repository.update('o1', { price: 6 });

    expect(runSql).toContain('UPDATE product_offers SET');
    expect(runSql).toContain('normalizedPrice = ?');
    expect(runSql).toContain('observedAt = ?');
    expect(runParams).toContain(expected.normalizedPrice);
    expect(runParams).toContain(expected.normalizedUnit);
  });

  it('lists a product\'s offers with their price, cheapest first', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listForProduct('p1');

    expect(db.lastGetAllSql).toContain('WHERE off.productId = ?');
    expect(db.lastGetAllSql).not.toContain('product_offer_prices');
    expect(db.lastGetAllSql).toContain('ORDER BY off.normalizedPrice');
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

  it('lists priced offers for a category, newest first', async () => {
    const db = createDb();
    const repository = createProductOfferRepository(db);

    await repository.listPriceEventsForCategory('category-1');

    expect(db.lastGetAllSql).toContain('FROM product_offers off');
    expect(db.lastGetAllSql).toContain('WHERE p.categoryId = ?');
    expect(db.lastGetAllSql).toContain('off.price IS NOT NULL');
    expect(db.lastGetAllSql).toContain('ORDER BY off.observedAt DESC');
    expect(db.lastGetAllParams).toEqual(['category-1']);
  });
});
