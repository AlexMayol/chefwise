import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, fromSqlBoolean, insertRow, nowIso, toSqlBoolean, updateRow } from './base';

export type Product = {
  id: string;
  name: string;
  categoryId: string | null;
  defaultUnit: Unit;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductRow = Omit<Product, 'isFavorite'> & {
  isFavorite: number;
};

// Enriched list shape: a generic product plus a summary of its offers (how many, across how
// many markets, the cheapest current normalized price, and the cheapest offer's photo).
export type ProductListItem = Product & {
  offerCount: number;
  marketCount: number;
  bestNormalizedPrice: number | null;
  bestNormalizedUnit: NormalizedUnit | null;
  bestImagePath: string | null;
};

type ProductListRow = ProductRow & Omit<ProductListItem, keyof Product>;

export type ProductInput = {
  name: string;
  categoryId?: string | null;
  defaultUnit: Unit;
  isFavorite?: boolean;
};

export type ProductSort = 'name' | 'favorites_first';

function mapProduct(row: ProductRow): Product {
  return { ...row, isFavorite: fromSqlBoolean(row.isFavorite) };
}

export function createProductRepository(db: AppDatabase) {
  // getById + delete come from the base (with the boolean row mapper); list/create/update
  // stay custom for the offer-summary join and isFavorite int<->bool conversion.
  const base = createCrudRepository<Product, ProductInput, ProductRow>(db, 'products', 'product', mapProduct);

  return {
    ...base,
    async list(options: { favoritesOnly?: boolean; sort?: ProductSort } = {}): Promise<ProductListItem[]> {
      const clauses: string[] = [];
      const params: number[] = [];

      if (options.favoritesOnly) {
        clauses.push('p.isFavorite = 1');
      }

      const orderBy =
        options.sort === 'favorites_first'
          ? 'p.isFavorite DESC, p.name COLLATE NOCASE ASC'
          : 'p.name COLLATE NOCASE ASC';

      // Per product: count offers/markets and surface the cheapest current normalized price.
      // Each offer's "current" price is its latest product_offer_prices row (window-join).
      // ponytail: SQLite's single-MIN rule makes bestNormalizedUnit take its value from the
      // MIN(normalizedPrice) row, so we get the cheapest offer's unit without a self-join.
      // bestImagePath is independent of price: the top-rated offer that actually has a photo
      // (NULL ratings sort last under DESC), via a correlated subselect.
      const rows = await db.getAllAsync<ProductListRow>(
        `SELECT p.*,
                COALESCE(agg.offerCount, 0) AS offerCount,
                COALESCE(agg.marketCount, 0) AS marketCount,
                agg.bestNormalizedPrice AS bestNormalizedPrice,
                agg.bestNormalizedUnit AS bestNormalizedUnit,
                (SELECT img.imagePath
                   FROM product_offers img
                  WHERE img.productId = p.id AND img.imagePath IS NOT NULL
                  ORDER BY img.rating DESC, img.createdAt DESC, img.id DESC
                  LIMIT 1) AS bestImagePath
         FROM products p
         LEFT JOIN (
           SELECT off.productId AS productId,
                  COUNT(*) AS offerCount,
                  COUNT(DISTINCT off.marketId) AS marketCount,
                  MIN(lp.normalizedPrice) AS bestNormalizedPrice,
                  lp.normalizedUnit AS bestNormalizedUnit
           FROM product_offers off
           LEFT JOIN (
             SELECT offerId, normalizedPrice, normalizedUnit,
                    ROW_NUMBER() OVER (PARTITION BY offerId ORDER BY observedAt DESC, id DESC) AS rn
             FROM product_offer_prices
           ) lp ON lp.offerId = off.id AND lp.rn = 1
           GROUP BY off.productId
         ) agg ON agg.productId = p.id
         ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''}
         ORDER BY ${orderBy}`,
        params,
      );
      return rows.map((row) => ({
        ...mapProduct(row),
        offerCount: row.offerCount,
        marketCount: row.marketCount,
        bestNormalizedPrice: row.bestNormalizedPrice,
        bestNormalizedUnit: row.bestNormalizedUnit,
        bestImagePath: row.bestImagePath,
      }));
    },
    async create(input: ProductInput): Promise<Product> {
      const timestamp = nowIso();
      const row: ProductRow = {
        id: createId('product'),
        name: input.name,
        categoryId: input.categoryId ?? null,
        defaultUnit: input.defaultUnit,
        isFavorite: toSqlBoolean(input.isFavorite ?? false),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'products', row);
      return mapProduct(row);
    },
    async update(id: string, input: Partial<ProductInput>): Promise<void> {
      const patch = {
        ...input,
        ...(input.isFavorite === undefined ? {} : { isFavorite: toSqlBoolean(input.isFavorite) }),
        updatedAt: nowIso(),
      };
      await updateRow(db, 'products', id, patch);
    },
  };
}
