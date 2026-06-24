import type { Unit } from './units';

export type BoughtWorkflowInput = {
  item: {
    id: string;
    productId: string;
  };
  actualQuantity?: number;
  actualUnit?: Unit;
  actualPrice?: number;
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
  createPrice(input: {
    productId: string;
    price: number;
    quantity: number;
    unit: Unit;
    observedAt: string;
  }): Promise<{ id: string }>;
  updateItemBought(input: {
    itemId: string;
    productPriceId: string;
    actualQuantity: number;
    actualUnit: Unit;
    actualPrice: number;
  }): Promise<void>;
  recordPurchaseInPantry(input: {
    productId: string;
    shoppingListItemId: string;
    quantity: number;
    unit: Unit;
  }): Promise<void>;
};

export async function markShoppingItemBought(input: BoughtWorkflowInput): Promise<void> {
  const { actualQuantity, actualUnit, actualPrice } = input;

  if (!actualQuantity || !actualUnit || !actualPrice) {
    throw new Error('shopping.missingActuals');
  }

  await input.runInTransaction(async () => {
    const price = await input.createPrice({
      productId: input.item.productId,
      price: actualPrice,
      quantity: actualQuantity,
      unit: actualUnit,
      observedAt: new Date().toISOString(),
    });

    await input.updateItemBought({
      itemId: input.item.id,
      productPriceId: price.id,
      actualQuantity,
      actualUnit,
      actualPrice,
    });

    await input.recordPurchaseInPantry({
      productId: input.item.productId,
      shoppingListItemId: input.item.id,
      quantity: actualQuantity,
      unit: actualUnit,
    });
  });
}

export function canCompleteShoppingList(items: Array<{ status: 'pending' | 'bought' | 'skipped' }>): boolean {
  return items.length > 0 && items.every((item) => item.status === 'bought' || item.status === 'skipped');
}
