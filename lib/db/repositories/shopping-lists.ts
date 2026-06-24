import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso, updateRow } from './base';

export type ShoppingListStatus = 'draft' | 'active' | 'completed' | 'archived';
export type ShoppingListItemStatus = 'pending' | 'bought' | 'skipped';

export type ShoppingList = {
  id: string;
  name: string;
  status: ShoppingListStatus;
  createdAt: string;
  updatedAt: string;
};

export type ShoppingListInput = {
  name: string;
  status: ShoppingListStatus;
};

export type ShoppingListItem = {
  id: string;
  shoppingListId: string;
  productId: string;
  plannedQuantity: number;
  plannedUnit: Unit;
  status: ShoppingListItemStatus;
  actualQuantity: number | null;
  actualUnit: Unit | null;
  actualPrice: number | null;
  marketId: string | null;
  productPriceId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShoppingListItemInput = {
  shoppingListId: string;
  productId: string;
  plannedQuantity: number;
  plannedUnit: Unit;
};

export function createShoppingListRepository(db: AppDatabase) {
  const lists = createCrudRepository<ShoppingList, ShoppingListInput>(db, 'shopping_lists', 'shopping-list');

  return {
    ...lists,
    async listItems(shoppingListId: string): Promise<ShoppingListItem[]> {
      return db.getAllAsync<ShoppingListItem>(
        'SELECT * FROM shopping_list_items WHERE shoppingListId = ? ORDER BY createdAt ASC',
        [shoppingListId],
      );
    },
    async addItem(input: ShoppingListItemInput): Promise<ShoppingListItem> {
      const timestamp = nowIso();
      const item: ShoppingListItem = {
        id: createId('shopping-item'),
        shoppingListId: input.shoppingListId,
        productId: input.productId,
        plannedQuantity: input.plannedQuantity,
        plannedUnit: input.plannedUnit,
        status: 'pending',
        actualQuantity: null,
        actualUnit: null,
        actualPrice: null,
        marketId: null,
        productPriceId: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      return insertRow(db, 'shopping_list_items', item);
    },
    async markItemBought(input: {
      itemId: string;
      productPriceId: string;
      actualQuantity: number;
      actualUnit: Unit;
      actualPrice: number;
      marketId: string;
    }): Promise<void> {
      await updateRow(db, 'shopping_list_items', input.itemId, {
        status: 'bought',
        actualQuantity: input.actualQuantity,
        actualUnit: input.actualUnit,
        actualPrice: input.actualPrice,
        marketId: input.marketId,
        productPriceId: input.productPriceId,
        updatedAt: nowIso(),
      });
    },
    async markItemSkipped(itemId: string): Promise<void> {
      await updateRow(db, 'shopping_list_items', itemId, {
        status: 'skipped',
        updatedAt: nowIso(),
      });
    },
    async duplicateAsDraft(sourceListId: string, name: string): Promise<ShoppingList> {
      const draft = await lists.create({ name, status: 'draft' });
      const items = await this.listItems(sourceListId);

      for (const item of items) {
        await this.addItem({
          shoppingListId: draft.id,
          productId: item.productId,
          plannedQuantity: item.plannedQuantity,
          plannedUnit: item.plannedUnit,
        });
      }

      return draft;
    },
  };
}
