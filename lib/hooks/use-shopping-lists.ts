import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { ProductPriceInput } from '@/lib/db/repositories/product-prices';
import type { ShoppingList, ShoppingListInput, ShoppingListItem, ShoppingListItemInput } from '@/lib/db/repositories/shopping-lists';
import { recordPurchaseInPantry } from '@/lib/domain/pantry';
import { canCompleteShoppingList, markShoppingItemBought } from '@/lib/domain/shopping';
import type { Unit } from '@/lib/domain/units';

export function useShoppingLists() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.shoppingLists.list());
    } finally {
      setLoading(false);
    }
  }, [repositories.shoppingLists]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: ShoppingListInput) => {
      const list = await repositories.shoppingLists.create(input);
      await reload();
      return list;
    },
    [reload, repositories.shoppingLists],
  );

  const addItem = useCallback(
    async (input: ShoppingListItemInput) => repositories.shoppingLists.addItem(input),
    [repositories.shoppingLists],
  );

  const duplicateAsDraft = useCallback(
    async (sourceListId: string, name: string) => {
      const list = await repositories.shoppingLists.duplicateAsDraft(sourceListId, name);
      await reload();
      return list;
    },
    [reload, repositories.shoppingLists],
  );

  return { items, loading, reload, create, addItem, duplicateAsDraft };
}

export function useShoppingListDetail(shoppingListId?: string) {
  const { db, repositories } = useAppDatabase();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(Boolean(shoppingListId));

  const reload = useCallback(async () => {
    if (!shoppingListId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await repositories.shoppingLists.listItems(shoppingListId));
    } finally {
      setLoading(false);
    }
  }, [repositories.shoppingLists, shoppingListId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addItem = useCallback(
    async (input: ShoppingListItemInput) => {
      const item = await repositories.shoppingLists.addItem(input);
      await reload();
      return item;
    },
    [reload, repositories.shoppingLists],
  );

  const markBought = useCallback(
    async (input: { item: ShoppingListItem; actualQuantity: number; actualUnit: Unit; actualPrice: number }) => {
      await markShoppingItemBought({
        item: input.item,
        actualQuantity: input.actualQuantity,
        actualUnit: input.actualUnit,
        actualPrice: input.actualPrice,
        runInTransaction: (work) => db.withTransactionAsync(work),
        createPrice: (priceInput: ProductPriceInput) => repositories.productPrices.create(priceInput),
        updateItemBought: (boughtInput) => repositories.shoppingLists.markItemBought(boughtInput),
        recordPurchaseInPantry: async (pantryInput) => {
          const product = await repositories.products.getById(pantryInput.productId);
          await recordPurchaseInPantry({
            ...pantryInput,
            defaultUnit: product?.defaultUnit,
            getItemByProduct: (productId) => repositories.pantry.getItemByProduct(productId),
            upsertItem: (input) => repositories.pantry.upsertItem(input),
            createTransaction: (input) => repositories.pantry.createTransaction(input),
          });
        },
      });
      const nextItems = await repositories.shoppingLists.listItems(input.item.shoppingListId);
      if (canCompleteShoppingList(nextItems)) {
        await repositories.shoppingLists.update(input.item.shoppingListId, { status: 'completed' });
      }
      await reload();
    },
    [db, reload, repositories.pantry, repositories.productPrices, repositories.products, repositories.shoppingLists],
  );

  const markSkipped = useCallback(
    async (itemId: string) => {
      await repositories.shoppingLists.markItemSkipped(itemId);
      if (shoppingListId) {
        const nextItems = await repositories.shoppingLists.listItems(shoppingListId);
        if (canCompleteShoppingList(nextItems)) {
          await repositories.shoppingLists.update(shoppingListId, { status: 'completed' });
        }
      }
      await reload();
    },
    [reload, repositories.shoppingLists, shoppingListId],
  );

  const remove = useCallback(async () => {
    if (!shoppingListId) {
      return;
    }

    await repositories.shoppingLists.delete(shoppingListId);
  }, [repositories.shoppingLists, shoppingListId]);

  return { items, loading, reload, addItem, markBought, markSkipped, remove };
}
