import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Product, ProductInput, ProductListItem, ProductSort } from '@/lib/db/repositories/products';

import { useDetail } from './use-detail';

export function useProducts(options: { favoritesOnly?: boolean; minRating?: number; sort?: ProductSort } = {}) {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.products.list(options));
    } finally {
      setLoading(false);
    }
  }, [options.favoritesOnly, options.minRating, options.sort, repositories.products]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: ProductInput) => {
      const product = await repositories.products.create(input);
      await reload();
      return product;
    },
    [reload, repositories.products],
  );

  const update = useCallback(
    async (id: string, input: Partial<ProductInput>) => {
      await repositories.products.update(id, input);
      await reload();
    },
    [reload, repositories.products],
  );

  const remove = useCallback(
    async (id: string) => {
      await repositories.products.delete(id);
      await reload();
    },
    [reload, repositories.products],
  );

  // Delete many at once. allSettled so one FK-blocked delete doesn't abort the
  // rest; reload once; throw if any failed so the UI can show the blocked message.
  const removeMany = useCallback(
    async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => repositories.products.delete(id)));
      await reload();
      if (results.some((result) => result.status === 'rejected')) {
        throw new Error('partial-delete');
      }
    },
    [reload, repositories.products],
  );

  // Apply the same patch to many products (e.g. reassign category), then reload once.
  const assign = useCallback(
    async (ids: string[], patch: Partial<ProductInput>) => {
      await Promise.all(ids.map((id) => repositories.products.update(id, patch)));
      await reload();
    },
    [reload, repositories.products],
  );

  return { items, loading, reload, create, update, remove, removeMany, assign };
}

export function useProductDetail(productId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback((id: string) => repositories.products.getById(id), [repositories.products]);
  const { item, loading, reload } = useDetail<Product | null>(productId, load, null);

  const update = useCallback(
    async (input: Partial<ProductInput>) => {
      if (!productId) {
        return;
      }

      await repositories.products.update(productId, input);
      await reload();
    },
    [productId, reload, repositories.products],
  );

  const remove = useCallback(async () => {
    if (!productId) {
      return;
    }

    await repositories.products.delete(productId);
    await reload();
  }, [productId, reload, repositories.products]);

  return { item, loading, reload, update, remove };
}
