import { createAppRepositories } from '@/lib/db/repositories';
import type { AppDatabase } from '@/lib/db/client';

function createDb(): AppDatabase {
  return {
    execAsync: async () => undefined,
    getFirstAsync: async () => null,
    getAllAsync: async () => [],
    runAsync: async () => ({ changes: 1 }),
    withTransactionAsync: async (work) => work(),
    serializeAsync: async () => new Uint8Array(),
  };
}

describe('app repository bundle', () => {
  it('creates all feature repositories from one database connection', () => {
    const repositories = createAppRepositories(createDb());

    expect(repositories.products.create).toEqual(expect.any(Function));
    expect(repositories.categories.create).toEqual(expect.any(Function));
    expect(repositories.markets.create).toEqual(expect.any(Function));
    expect(repositories.productOffers.create).toEqual(expect.any(Function));
    expect(repositories.productOffers.listForProduct).toEqual(expect.any(Function));
    expect(repositories.productOfferPrices.create).toEqual(expect.any(Function));
    expect(repositories.productPrices.create).toEqual(expect.any(Function));
    expect(repositories.recipes.list).toEqual(expect.any(Function));
    expect(repositories.shoppingLists.list).toEqual(expect.any(Function));
    expect(repositories.pantry.listItems).toEqual(expect.any(Function));
  });
});
