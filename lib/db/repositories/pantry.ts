import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createId, insertRow, nowIso, updateRow } from './base';

export type PantryTransactionType = 'purchase' | 'add' | 'remove' | 'adjust' | 'waste' | 'consume';

export type PantryItem = {
  id: string;
  productId: string;
  quantity: number;
  unit: Unit;
  updatedAt: string;
};

export type PantryTransaction = {
  id: string;
  productId: string;
  pantryItemId: string | null;
  type: PantryTransactionType;
  quantity: number;
  unit: Unit;
  occurredAt: string;
  note: string | null;
  shoppingListItemId: string | null;
  recipeId: string | null;
};

export function createPantryRepository(db: AppDatabase) {
  return {
    async listItems(): Promise<PantryItem[]> {
      return db.getAllAsync<PantryItem>('SELECT * FROM pantry_items ORDER BY updatedAt DESC');
    },
    async getItemByProduct(productId: string): Promise<PantryItem | null> {
      return db.getFirstAsync<PantryItem>('SELECT * FROM pantry_items WHERE productId = ?', [productId]);
    },
    async listTransactions(productId?: string): Promise<PantryTransaction[]> {
      const clause = productId ? ' WHERE productId = ?' : '';
      const params = productId ? [productId] : [];
      return db.getAllAsync<PantryTransaction>(
        `SELECT * FROM pantry_transactions${clause} ORDER BY occurredAt DESC`,
        params,
      );
    },
    async upsertItem(input: { productId: string; quantity: number; unit: Unit }): Promise<PantryItem> {
      const existing = await this.getItemByProduct(input.productId);
      const timestamp = nowIso();

      if (existing) {
        await updateRow(db, 'pantry_items', existing.id, {
          quantity: input.quantity,
          unit: input.unit,
          updatedAt: timestamp,
        });
        return { ...existing, quantity: input.quantity, unit: input.unit, updatedAt: timestamp };
      }

      const item: PantryItem = {
        id: createId('pantry-item'),
        productId: input.productId,
        quantity: input.quantity,
        unit: input.unit,
        updatedAt: timestamp,
      };

      return insertRow(db, 'pantry_items', item);
    },
    async createTransaction(input: {
      productId: string;
      pantryItemId?: string | null;
      type: PantryTransactionType;
      quantity: number;
      unit: Unit;
      note?: string | null;
      shoppingListItemId?: string | null;
      recipeId?: string | null;
    }): Promise<PantryTransaction> {
      const transaction: PantryTransaction = {
        id: createId('pantry-transaction'),
        productId: input.productId,
        pantryItemId: input.pantryItemId ?? null,
        type: input.type,
        quantity: input.quantity,
        unit: input.unit,
        occurredAt: nowIso(),
        note: input.note ?? null,
        shoppingListItemId: input.shoppingListItemId ?? null,
        recipeId: input.recipeId ?? null,
      };

      return insertRow(db, 'pantry_transactions', transaction);
    },
  };
}
