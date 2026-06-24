import { convertQuantity, type Unit } from './units';

export type PantryQuantity = {
  productId: string;
  quantity: number;
  unit: Unit;
};

export type RecordPurchaseInPantryInput<TPantryItem extends PantryQuantity & { id?: string }> = {
  productId: string;
  shoppingListItemId: string;
  quantity: number;
  unit: Unit;
  defaultUnit?: Unit;
  getItemByProduct(productId: string): Promise<TPantryItem | null>;
  upsertItem(input: PantryQuantity): Promise<TPantryItem & { id: string }>;
  createTransaction(input: {
    productId: string;
    pantryItemId: string;
    shoppingListItemId: string;
    type: 'purchase';
    quantity: number;
    unit: Unit;
  }): Promise<unknown>;
};

export function applyPantryChange({
  currentItem,
  change,
  defaultUnit,
}: {
  currentItem?: PantryQuantity | null;
  change: { quantity: number; unit: Unit; direction: 'increase' | 'decrease' | 'set' };
  defaultUnit: Unit;
}): PantryQuantity {
  const productId = currentItem?.productId ?? '';
  const currentQuantity = currentItem
    ? convertQuantity({ quantity: currentItem.quantity, fromUnit: currentItem.unit, toUnit: defaultUnit })
    : 0;
  const changeQuantity = convertQuantity({ quantity: change.quantity, fromUnit: change.unit, toUnit: defaultUnit });

  const nextQuantity =
    change.direction === 'set'
      ? changeQuantity
      : change.direction === 'increase'
        ? currentQuantity + changeQuantity
        : currentQuantity - changeQuantity;

  return {
    productId,
    quantity: Math.max(0, nextQuantity),
    unit: defaultUnit,
  };
}

export async function recordPurchaseInPantry<TPantryItem extends PantryQuantity & { id?: string }>({
  productId,
  shoppingListItemId,
  quantity,
  unit,
  defaultUnit,
  getItemByProduct,
  upsertItem,
  createTransaction,
}: RecordPurchaseInPantryInput<TPantryItem>): Promise<TPantryItem & { id: string }> {
  const existing = await getItemByProduct(productId);
  const next = applyPantryChange({
    currentItem: existing,
    change: { quantity, unit, direction: 'increase' },
    defaultUnit: existing?.unit ?? defaultUnit ?? unit,
  });
  const item = await upsertItem({ ...next, productId });

  await createTransaction({
    productId,
    pantryItemId: item.id,
    shoppingListItemId,
    type: 'purchase',
    quantity,
    unit,
  });

  return item;
}

export function consumeRecipeBatch({
  pantryItems,
  ingredients,
}: {
  pantryItems: PantryQuantity[];
  ingredients: Array<{ productId: string; quantity: number; unit: Unit }>;
}): { ok: true; nextItems: PantryQuantity[] } | { ok: false; missingProductIds: string[] } {
  const missingProductIds: string[] = [];
  const nextItems = pantryItems.map((item) => ({ ...item }));

  for (const ingredient of ingredients) {
    const item = nextItems.find((candidate) => candidate.productId === ingredient.productId);

    if (!item) {
      missingProductIds.push(ingredient.productId);
      continue;
    }

    const required = convertQuantity({ quantity: ingredient.quantity, fromUnit: ingredient.unit, toUnit: item.unit });

    if (item.quantity < required) {
      missingProductIds.push(ingredient.productId);
      continue;
    }

    item.quantity -= required;
  }

  if (missingProductIds.length > 0) {
    return { ok: false, missingProductIds };
  }

  return { ok: true, nextItems };
}
