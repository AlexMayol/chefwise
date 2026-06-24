import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Product, ProductInput, ProductListItem, ProductSort } from '@/lib/db/repositories/products';
import type { Unit } from '@/lib/domain/units';

type InitialPrice = { price: number; quantity: number; unit: Unit };

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
    async (input: ProductInput, initialPrice?: InitialPrice) => {
      const product = await repositories.products.create(input);
      if (initialPrice && initialPrice.price > 0) {
        await repositories.productPrices.create({
          productId: product.id,
          price: initialPrice.price,
          quantity: initialPrice.quantity,
          unit: initialPrice.unit,
          observedAt: new Date().toISOString(),
        });
      }
      await reload();
      return product;
    },
    [reload, repositories.productPrices, repositories.products],
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

  return { items, loading, reload, create, update, remove };
}

export function useProductDetail(productId?: string) {
  const { repositories } = useAppDatabase();
  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(productId));

  const reload = useCallback(async () => {
    if (!productId) {
      setItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItem(await repositories.products.getById(productId));
    } finally {
      setLoading(false);
    }
  }, [productId, repositories.products]);

  useEffect(() => {
    void reload();
  }, [reload]);

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
