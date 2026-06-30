import { normalizePrice } from '@/lib/domain/pricing';
import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso, updateRow } from './base';

// An offer carries its single current price inline (nullable — it may not be priced yet).
// normalizedPrice/normalizedUnit are computed from the offer's quantity/unit at write time;
// observedAt is the date the price was last set/changed.
export type ProductOffer = {
  id: string;
  productId: string;
  marketId: string;
  brand: string | null;
  quantity: number;
  unit: Unit;
  rating: number | null;
  imagePath: string | null;
  description: string | null;
  price: number | null;
  normalizedPrice: number | null;
  normalizedUnit: NormalizedUnit | null;
  observedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductOfferInput = {
  productId: string;
  marketId: string;
  brand?: string | null;
  quantity: number;
  unit: Unit;
  rating?: number | null;
  imagePath?: string | null;
  description?: string | null;
  price?: number | null;
};

// Offer plus which market it's at (the price fields live on the offer itself now).
export type ProductOfferListItem = ProductOffer & {
  marketName: string | null;
};

export type MarketOfferListItem = ProductOfferListItem & {
  productName: string | null;
};

// One priced offer in a category, joined with product + market names. Powers the category
// detail Insights/Activity tabs (one row per offer; aggregates derived in
// lib/domain/category-insights.ts).
export type CategoryPriceEventItem = {
  offerId: string;
  productId: string;
  productName: string | null;
  marketId: string;
  marketName: string | null;
  price: number;
  normalizedPrice: number;
  normalizedUnit: NormalizedUnit;
  observedAt: string;
};

export function createProductOfferRepository(db: AppDatabase) {
  const base = createCrudRepository<ProductOffer, ProductOfferInput>(db, 'product_offers', 'offer');

  return {
    ...base,
    async create(input: ProductOfferInput): Promise<ProductOffer> {
      const timestamp = nowIso();
      const normalized =
        input.price != null ? normalizePrice({ price: input.price, quantity: input.quantity, unit: input.unit }) : null;
      const row: ProductOffer = {
        id: createId('offer'),
        productId: input.productId,
        marketId: input.marketId,
        brand: input.brand ?? null,
        quantity: input.quantity,
        unit: input.unit,
        rating: input.rating ?? null,
        imagePath: input.imagePath ?? null,
        description: input.description ?? null,
        price: input.price ?? null,
        normalizedPrice: normalized?.normalizedPrice ?? null,
        normalizedUnit: normalized?.normalizedUnit ?? null,
        observedAt: input.price != null ? timestamp : null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'product_offers', row);
      return row;
    },
    // Re-derives normalizedPrice when the price or the size (quantity/unit) changes, and
    // stamps observedAt when the price itself changes. Replaces the old renormalizeForOffer.
    async update(id: string, input: Partial<ProductOfferInput>): Promise<void> {
      const patch: Record<string, unknown> = { ...input, updatedAt: nowIso() };
      const priceChanging = input.price !== undefined;
      const sizeChanging = input.quantity != null || input.unit != null;

      if (priceChanging || sizeChanging) {
        const existing = await db.getFirstAsync<{ quantity: number; unit: Unit; price: number | null }>(
          'SELECT quantity, unit, price FROM product_offers WHERE id = ?',
          [id],
        );
        const quantity = input.quantity ?? existing?.quantity ?? 1;
        const unit = (input.unit ?? existing?.unit ?? 'unit') as Unit;
        const price = priceChanging ? input.price : (existing?.price ?? null);

        if (price != null) {
          const normalized = normalizePrice({ price, quantity, unit });
          patch.normalizedPrice = normalized.normalizedPrice;
          patch.normalizedUnit = normalized.normalizedUnit;
        } else {
          patch.normalizedPrice = null;
          patch.normalizedUnit = null;
        }
        if (priceChanging) {
          patch.observedAt = price != null ? nowIso() : null;
        }
      }

      await updateRow(db, 'product_offers', id, patch);
    },
    async listForProduct(productId: string): Promise<ProductOfferListItem[]> {
      // Cheapest current offer first; offers without a price sort last (NULL).
      return db.getAllAsync<ProductOfferListItem>(
        `SELECT off.*, m.name AS marketName
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         WHERE off.productId = ?
         ORDER BY off.normalizedPrice IS NULL, off.normalizedPrice ASC, off.createdAt ASC`,
        [productId],
      );
    },
    async listForMarket(marketId: string): Promise<MarketOfferListItem[]> {
      return db.getAllAsync<MarketOfferListItem>(
        `SELECT off.*, m.name AS marketName, p.name AS productName
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         LEFT JOIN products p ON p.id = off.productId
         WHERE off.marketId = ?
         ORDER BY p.name COLLATE NOCASE ASC, off.createdAt ASC`,
        [marketId],
      );
    },
    // Every offer across all markets with its price — for market-list aggregates.
    async listAll(): Promise<MarketOfferListItem[]> {
      return db.getAllAsync<MarketOfferListItem>(
        `SELECT off.*, m.name AS marketName, p.name AS productName
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         LEFT JOIN products p ON p.id = off.productId
         ORDER BY off.createdAt ASC`,
      );
    },
    // Every priced offer whose product is in this category, newest price first.
    async listPriceEventsForCategory(categoryId: string): Promise<CategoryPriceEventItem[]> {
      return db.getAllAsync<CategoryPriceEventItem>(
        `SELECT off.id AS offerId, off.productId AS productId, p.name AS productName,
                off.marketId AS marketId, m.name AS marketName,
                off.price AS price, off.normalizedPrice AS normalizedPrice,
                off.normalizedUnit AS normalizedUnit, off.observedAt AS observedAt
         FROM product_offers off
         JOIN products p ON p.id = off.productId
         LEFT JOIN markets m ON m.id = off.marketId
         WHERE p.categoryId = ? AND off.price IS NOT NULL
         ORDER BY off.observedAt DESC, off.id DESC`,
        [categoryId],
      );
    },
  };
}
