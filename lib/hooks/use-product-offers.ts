import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type {
  MarketOfferListItem,
  ProductOffer,
  ProductOfferInput,
  ProductOfferListItem,
} from '@/lib/db/repositories/product-offers';

import { useDetail } from './use-detail';

export function useProductOffers(productId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback(
    (id: string) => repositories.productOffers.listForProduct(id),
    [repositories.productOffers],
  );
  const { item: items, loading, reload } = useDetail<ProductOfferListItem[]>(productId, load, []);

  const create = useCallback(
    async (input: ProductOfferInput) => {
      const offer = await repositories.productOffers.create(input);
      await reload();
      return offer;
    },
    [reload, repositories.productOffers],
  );

  // Create an offer and record its first price in one step (the common "add offer" flow).
  const createWithPrice = useCallback(
    async (input: ProductOfferInput, price: number) => {
      const offer = await repositories.productOffers.create(input);
      await repositories.productOfferPrices.create({ offerId: offer.id, price, observedAt: new Date().toISOString() });
      await reload();
      return offer;
    },
    [reload, repositories.productOfferPrices, repositories.productOffers],
  );

  const update = useCallback(
    async (id: string, input: Partial<ProductOfferInput>) => {
      await repositories.productOffers.update(id, input);
      await reload();
    },
    [reload, repositories.productOffers],
  );

  const remove = useCallback(
    async (id: string) => {
      await repositories.productOffers.delete(id);
      await reload();
    },
    [reload, repositories.productOffers],
  );

  return { items, loading, reload, create, createWithPrice, update, remove };
}

export function useOffer(offerId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback((id: string) => repositories.productOffers.getById(id), [repositories.productOffers]);
  const { item, loading, reload } = useDetail<ProductOffer | null>(offerId, load, null);

  const remove = useCallback(async () => {
    if (!offerId) {
      return;
    }
    await repositories.productOffers.delete(offerId);
  }, [offerId, repositories.productOffers]);

  return { item, loading, reload, remove };
}

// Every offer across all markets — for the markets list aggregates.
export function useAllOffers() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<MarketOfferListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.productOffers.listAll());
    } finally {
      setLoading(false);
    }
  }, [repositories.productOffers]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, reload };
}

export function useMarketOffers(marketId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback((id: string) => repositories.productOffers.listForMarket(id), [repositories.productOffers]);
  const { item: items, loading, reload } = useDetail<MarketOfferListItem[]>(marketId, load, []);

  const create = useCallback(
    async (input: ProductOfferInput) => {
      const offer = await repositories.productOffers.create(input);
      await reload();
      return offer;
    },
    [reload, repositories.productOffers],
  );

  const remove = useCallback(
    async (id: string) => {
      await repositories.productOffers.delete(id);
      await reload();
    },
    [reload, repositories.productOffers],
  );

  return { items, loading, reload, create, remove };
}
