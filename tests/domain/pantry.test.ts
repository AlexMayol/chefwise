import { applyPantryChange, consumeRecipeBatch, recordPurchaseInPantry } from '@/lib/domain/pantry';

describe('pantry inventory', () => {
  it('merges compatible purchase quantities into the product default unit', () => {
    const result = applyPantryChange({
      currentItem: { productId: 'flour', quantity: 1, unit: 'kg' },
      change: { quantity: 500, unit: 'g', direction: 'increase' },
      defaultUnit: 'kg',
    });

    expect(result.quantity).toBe(1.5);
    expect(result.unit).toBe('kg');
  });

  it('blocks consumption when pantry quantity is missing', () => {
    const result = consumeRecipeBatch({
      pantryItems: [{ productId: 'flour', quantity: 100, unit: 'g' }],
      ingredients: [{ productId: 'flour', quantity: 200, unit: 'g' }],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingProductIds).toEqual(['flour']);
    }
  });

  it('records shopping purchases with the shopping item transaction link', async () => {
    const upsertItem = jest.fn(async () => ({ id: 'pantry-item-1', productId: 'flour', quantity: 1.5, unit: 'kg' as const, updatedAt: 'now' }));
    const createTransaction = jest.fn(async () => undefined);

    await recordPurchaseInPantry({
      productId: 'flour',
      shoppingListItemId: 'shopping-item-1',
      quantity: 500,
      unit: 'g',
      getItemByProduct: async () => ({ productId: 'flour', quantity: 1, unit: 'kg' }),
      upsertItem,
      createTransaction,
    });

    expect(upsertItem).toHaveBeenCalledWith({ productId: 'flour', quantity: 1.5, unit: 'kg' });
    expect(createTransaction).toHaveBeenCalledWith({
      productId: 'flour',
      pantryItemId: 'pantry-item-1',
      shoppingListItemId: 'shopping-item-1',
      type: 'purchase',
      quantity: 500,
      unit: 'g',
    });
  });
});
