import { normalizePrice } from '@/lib/domain/pricing';
import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createId, insertRow, nowIso } from './base';

export type ProductOfferPrice = {
  id: string;
  offerId: string;
  price: number;
  normalizedPrice: number;
  normalizedUnit: NormalizedUnit;
  observedAt: string;
  createdAt: string;
};

// Quantity/unit live on the offer now, so a price observation is just price + date.
export type ProductOfferPriceInput = {
  offerId: string;
  price: number;
  observedAt: string;
};

export function createProductOfferPriceRepository(db: AppDatabase) {
  return {
    async create(input: ProductOfferPriceInput): Promise<ProductOfferPrice> {
      const offer = await db.getFirstAsync<{ quantity: number; unit: Unit }>(
        'SELECT quantity, unit FROM product_offers WHERE id = ?',
        [input.offerId],
      );

      if (!offer) {
        throw new Error('offer-not-found');
      }

      const normalized = normalizePrice({ price: input.price, quantity: offer.quantity, unit: offer.unit });
      const row: ProductOfferPrice = {
        id: createId('offer-price'),
        offerId: input.offerId,
        price: input.price,
        normalizedPrice: normalized.normalizedPrice,
        normalizedUnit: normalized.normalizedUnit,
        observedAt: input.observedAt,
        createdAt: nowIso(),
      };

      return insertRow(db, 'product_offer_prices', row);
    },
    async listForOffer(offerId: string): Promise<ProductOfferPrice[]> {
      return db.getAllAsync<ProductOfferPrice>(
        'SELECT * FROM product_offer_prices WHERE offerId = ? ORDER BY observedAt DESC, id DESC',
        [offerId],
      );
    },
    async latestForOffer(offerId: string): Promise<ProductOfferPrice | null> {
      return db.getFirstAsync<ProductOfferPrice>(
        'SELECT * FROM product_offer_prices WHERE offerId = ? ORDER BY observedAt DESC, id DESC LIMIT 1',
        [offerId],
      );
    },
  };
}
