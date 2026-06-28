import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso } from './base';

export type ProductOffer = {
  id: string;
  productId: string;
  marketId: string;
  brand: string | null;
  quantity: number;
  unit: Unit;
  createdAt: string;
  updatedAt: string;
};

export type ProductOfferInput = {
  productId: string;
  marketId: string;
  brand?: string | null;
  quantity: number;
  unit: Unit;
};

// Offer plus the data comparison views surface: which market, and the latest price for it.
export type ProductOfferListItem = ProductOffer & {
  marketName: string | null;
  price: number | null;
  normalizedPrice: number | null;
  normalizedUnit: NormalizedUnit | null;
  observedAt: string | null;
};

export type MarketOfferListItem = ProductOfferListItem & {
  productName: string | null;
};

// A single price observation for a category's offers, joined with product + market names.
// Powers the category detail Insights/Activity tabs (one query; latest-per-offer is derived
// in lib/domain/category-insights.ts).
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

// Latest price per offer via window-join — reused by both list queries below.
const LATEST_PRICE_SUBQUERY = `
  LEFT JOIN (
    SELECT offerId, price, normalizedPrice, normalizedUnit, observedAt,
           ROW_NUMBER() OVER (PARTITION BY offerId ORDER BY observedAt DESC, id DESC) AS rn
    FROM product_offer_prices
  ) lp ON lp.offerId = off.id AND lp.rn = 1`;

export function createProductOfferRepository(db: AppDatabase) {
  const base = createCrudRepository<ProductOffer, ProductOfferInput>(db, 'product_offers', 'offer');

  return {
    ...base,
    async create(input: ProductOfferInput): Promise<ProductOffer> {
      const timestamp = nowIso();
      const row: ProductOffer = {
        id: createId('offer'),
        productId: input.productId,
        marketId: input.marketId,
        brand: input.brand ?? null,
        quantity: input.quantity,
        unit: input.unit,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'product_offers', row);
      return row;
    },
    async listForProduct(productId: string): Promise<ProductOfferListItem[]> {
      // Cheapest current offer first; offers without a price sort last (NULL).
      return db.getAllAsync<ProductOfferListItem>(
        `SELECT off.*, m.name AS marketName,
                lp.price AS price, lp.normalizedPrice AS normalizedPrice,
                lp.normalizedUnit AS normalizedUnit, lp.observedAt AS observedAt
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         ${LATEST_PRICE_SUBQUERY}
         WHERE off.productId = ?
         ORDER BY lp.normalizedPrice IS NULL, lp.normalizedPrice ASC, off.createdAt ASC`,
        [productId],
      );
    },
    async listForMarket(marketId: string): Promise<MarketOfferListItem[]> {
      return db.getAllAsync<MarketOfferListItem>(
        `SELECT off.*, m.name AS marketName, p.name AS productName,
                lp.price AS price, lp.normalizedPrice AS normalizedPrice,
                lp.normalizedUnit AS normalizedUnit, lp.observedAt AS observedAt
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         LEFT JOIN products p ON p.id = off.productId
         ${LATEST_PRICE_SUBQUERY}
         WHERE off.marketId = ?
         ORDER BY p.name COLLATE NOCASE ASC, off.createdAt ASC`,
        [marketId],
      );
    },
    // Every offer across all markets with its latest price — for market-list aggregates.
    async listAll(): Promise<MarketOfferListItem[]> {
      return db.getAllAsync<MarketOfferListItem>(
        `SELECT off.*, m.name AS marketName, p.name AS productName,
                lp.price AS price, lp.normalizedPrice AS normalizedPrice,
                lp.normalizedUnit AS normalizedUnit, lp.observedAt AS observedAt
         FROM product_offers off
         LEFT JOIN markets m ON m.id = off.marketId
         LEFT JOIN products p ON p.id = off.productId
         ${LATEST_PRICE_SUBQUERY}
         ORDER BY off.createdAt ASC`,
      );
    },
    // Every price observation for offers whose product is in this category, newest first.
    async listPriceEventsForCategory(categoryId: string): Promise<CategoryPriceEventItem[]> {
      return db.getAllAsync<CategoryPriceEventItem>(
        `SELECT pp.offerId AS offerId, off.productId AS productId, p.name AS productName,
                off.marketId AS marketId, m.name AS marketName,
                pp.price AS price, pp.normalizedPrice AS normalizedPrice,
                pp.normalizedUnit AS normalizedUnit, pp.observedAt AS observedAt
         FROM product_offer_prices pp
         JOIN product_offers off ON off.id = pp.offerId
         JOIN products p ON p.id = off.productId
         LEFT JOIN markets m ON m.id = off.marketId
         WHERE p.categoryId = ?
         ORDER BY pp.observedAt DESC, pp.id DESC`,
        [categoryId],
      );
    },
  };
}
