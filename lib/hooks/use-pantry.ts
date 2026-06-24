import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import { applyPantryChange } from '@/lib/domain/pantry';
import type { Unit } from '@/lib/domain/units';
import type { PantryItem, PantryTransaction, PantryTransactionType } from '@/lib/db/repositories/pantry';

export function usePantry() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [transactions, setTransactions] = useState<PantryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [nextItems, nextTransactions] = await Promise.all([
        repositories.pantry.listItems(),
        repositories.pantry.listTransactions(),
      ]);
      setItems(nextItems);
      setTransactions(nextTransactions);
    } finally {
      setLoading(false);
    }
  }, [repositories.pantry]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const adjust = useCallback(
    async (input: { productId: string; type: PantryTransactionType; quantity: number; unit: Unit; note?: string | null }) => {
      const existing = await repositories.pantry.getItemByProduct(input.productId);
      const direction = input.type === 'adjust' ? 'set' : input.type === 'remove' || input.type === 'waste' || input.type === 'consume' ? 'decrease' : 'increase';
      const next = applyPantryChange({
        currentItem: existing,
        change: { quantity: input.quantity, unit: input.unit, direction },
        defaultUnit: existing?.unit ?? input.unit,
      });
      const item = await repositories.pantry.upsertItem({ ...next, productId: input.productId });
      await repositories.pantry.createTransaction({
        productId: input.productId,
        pantryItemId: item.id,
        type: input.type,
        quantity: input.quantity,
        unit: input.unit,
        note: input.note,
      });
      await reload();
      return item;
    },
    [reload, repositories.pantry],
  );

  return { items, transactions, loading, reload, adjust };
}
