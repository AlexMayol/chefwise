import { useCallback } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { ProductOfferPrice, ProductOfferPriceInput } from '@/lib/db/repositories/product-offer-prices';

import { useDetail } from './use-detail';

export function useOfferPrices(offerId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback(
    (id: string) => repositories.productOfferPrices.listForOffer(id),
    [repositories.productOfferPrices],
  );
  const { item: items, loading, reload } = useDetail<ProductOfferPrice[]>(offerId, load, []);

  const create = useCallback(
    async (input: ProductOfferPriceInput) => {
      const price = await repositories.productOfferPrices.create(input);
      await reload();
      return price;
    },
    [reload, repositories.productOfferPrices],
  );

  const latest = items.length > 0 ? items[0] : null;

  return { items, latest, loading, reload, create };
}
