import { markShoppingItemBought } from '@/lib/domain/shopping';

describe('shopping workflow', () => {
  it('requires actual quantity, unit, price, and market before marking bought', async () => {
    await expect(
      markShoppingItemBought({
        item: { id: 'item-1', productId: 'p-1' },
        actualQuantity: 1,
        actualUnit: 'unit',
        actualPrice: 2,
        marketId: '',
        runInTransaction: async (work) => work(),
        createPrice: jest.fn(),
        updateItemBought: jest.fn(),
        recordPurchaseInPantry: jest.fn(),
      }),
    ).rejects.toThrow('shopping.missingActuals');
  });

  it('runs bought updates in one transaction', async () => {
    const calls: string[] = [];

    await markShoppingItemBought({
      item: { id: 'item-1', productId: 'p-1' },
      actualQuantity: 2,
      actualUnit: 'unit',
      actualPrice: 4,
      marketId: 'm-1',
      runInTransaction: async (work) => {
        calls.push('transaction');
        return work();
      },
      createPrice: async () => {
        calls.push('price');
        return { id: 'price-1' };
      },
      updateItemBought: async () => {
        calls.push('item');
      },
      recordPurchaseInPantry: async () => {
        calls.push('pantry');
      },
    });

    expect(calls).toEqual(['transaction', 'price', 'item', 'pantry']);
  });
});
