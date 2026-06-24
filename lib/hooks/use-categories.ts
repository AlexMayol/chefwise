import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Category, CategoryInput } from '@/lib/db/repositories/categories';

export function useCategories() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.categories.list());
    } finally {
      setLoading(false);
    }
  }, [repositories.categories]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: CategoryInput) => {
      const category = await repositories.categories.create(input);
      await reload();
      return category;
    },
    [reload, repositories.categories],
  );

  const update = useCallback(
    async (id: string, input: Partial<CategoryInput>) => {
      await repositories.categories.update(id, input);
      await reload();
    },
    [reload, repositories.categories],
  );

  const remove = useCallback(
    async (id: string) => {
      await repositories.categories.delete(id);
      await reload();
    },
    [reload, repositories.categories],
  );

  return { items, loading, reload, create, update, remove };
}
