import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createProductOfferPriceRepository } from '@/lib/db/repositories/product-offer-prices';

function createDb(offer: { quantity: number; unit: string } | null): AppDatabase & {
  inserted: Record<string, SqlParameter>[];
  lastGetFirstSql?: string;
  lastGetFirstParams?: SqlParameter[] | Record<string, SqlParameter>;
} {
  const inserted: Record<string, SqlParameter>[] = [];
  const db: AppDatabase & {
    inserted: Record<string, SqlParameter>[];
    lastGetFirstSql?: string;
    lastGetFirstParams?: SqlParameter[] | Record<string, SqlParameter>;
  } = {
    inserted,
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async <T,>(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>) => {
      db.lastGetFirstSql = sql;
      db.lastGetFirstParams = params;
      return offer as T | null;
    },
    getAllAsync: async <T,>() => [] as T[],
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

describe('product offer price repository', () => {
  it('normalizes the price from the offer quantity/unit on create', async () => {
    const db = createDb({ quantity: 500, unit: 'g' });
    const repository = createProductOfferPriceRepository(db);

    const price = await repository.create({ offerId: 'offer-1', price: 3, observedAt: '2026-01-01' });

    // €3 for 500 g => €6/kg
    expect(price.normalizedPrice).toBe(6);
    expect(price.normalizedUnit).toBe('kg');
    expect(price.offerId).toBe('offer-1');
    expect(db.inserted).toHaveLength(1);
  });

  it('throws when the offer does not exist', async () => {
    const repository = createProductOfferPriceRepository(createDb(null));

    await expect(repository.create({ offerId: 'missing', price: 1, observedAt: '2026-01-01' })).rejects.toThrow();
  });

  it('looks up latest offer price by observed date and id tie-break', async () => {
    const db = createDb({ quantity: 1, unit: 'kg' });
    const repository = createProductOfferPriceRepository(db);

    await repository.latestForOffer('offer-1');

    expect(db.lastGetFirstSql).toContain('WHERE offerId = ?');
    expect(db.lastGetFirstSql).toContain('ORDER BY observedAt DESC, id DESC LIMIT 1');
    expect(db.lastGetFirstParams).toEqual(['offer-1']);
  });

  it('does not expose update or delete methods for immutable offer prices', () => {
    const repository = createProductOfferPriceRepository(createDb({ quantity: 1, unit: 'kg' }));

    expect(repository.create).toEqual(expect.any(Function));
    expect((repository as { update?: unknown }).update).toBeUndefined();
    expect((repository as { delete?: unknown }).delete).toBeUndefined();
  });
});
