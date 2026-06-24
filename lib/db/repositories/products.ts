import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createId, fromSqlBoolean, insertRow, nowIso, toSqlBoolean, updateRow } from './base';

export type Product = {
  id: string;
  name: string;
  categoryId: string | null;
  marketId: string;
  defaultUnit: Unit;
  rating: number | null;
  notes: string | null;
  isFavorite: boolean;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductRow = Omit<Product, 'isFavorite'> & {
  isFavorite: number;
};

// Enriched list shape: bare product plus the data the list card surfaces
// (market name + latest normalized price), joined in the list() query.
export type ProductListItem = Product & {
  marketName: string | null;
  price: number | null;
  normalizedPrice: number | null;
  normalizedUnit: NormalizedUnit | null;
};

type ProductListRow = ProductRow & Omit<ProductListItem, keyof Product>;

export type ProductInput = {
  name: string;
  categoryId?: string | null;
  marketId: string;
  defaultUnit: Unit;
  rating?: number | null;
  notes?: string | null;
  isFavorite?: boolean;
  imagePath?: string | null;
};

export type ProductSort = 'name' | 'highest_rated' | 'lowest_rated' | 'favorites_first';

function mapProduct(row: ProductRow): Product {
  return { ...row, isFavorite: fromSqlBoolean(row.isFavorite) };
}

export function createProductRepository(db: AppDatabase) {
  return {
    async list(options: { favoritesOnly?: boolean; minRating?: number; sort?: ProductSort } = {}): Promise<ProductListItem[]> {
      const clauses: string[] = [];
      const params: number[] = [];

      if (options.favoritesOnly) {
        clauses.push('p.isFavorite = 1');
      }

      if (options.minRating) {
        clauses.push('p.rating >= ?');
        params.push(options.minRating);
      }

      const orderBy =
        options.sort === 'highest_rated'
          ? 'p.rating DESC, p.name COLLATE NOCASE ASC'
          : options.sort === 'lowest_rated'
            ? 'p.rating ASC, p.name COLLATE NOCASE ASC'
            : options.sort === 'favorites_first'
              ? 'p.isFavorite DESC, p.name COLLATE NOCASE ASC'
              : 'p.name COLLATE NOCASE ASC';

      const rows = await db.getAllAsync<ProductListRow>(
        `SELECT p.*, m.name AS marketName,
                lp.price AS price, lp.normalizedPrice AS normalizedPrice, lp.normalizedUnit AS normalizedUnit
         FROM products p
         LEFT JOIN markets m ON m.id = p.marketId
         LEFT JOIN (
           SELECT productId, price, normalizedPrice, normalizedUnit,
                  ROW_NUMBER() OVER (PARTITION BY productId ORDER BY observedAt DESC, id DESC) AS rn
           FROM product_prices
         ) lp ON lp.productId = p.id AND lp.rn = 1
         ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''}
         ORDER BY ${orderBy}`,
        params,
      );
      return rows.map((row) => ({
        ...mapProduct(row),
        marketName: row.marketName,
        price: row.price,
        normalizedPrice: row.normalizedPrice,
        normalizedUnit: row.normalizedUnit,
      }));
    },
    async getById(id: string): Promise<Product | null> {
      const row = await db.getFirstAsync<ProductRow>('SELECT * FROM products WHERE id = ?', [id]);
      return row ? mapProduct(row) : null;
    },
    async create(input: ProductInput): Promise<Product> {
      const timestamp = nowIso();
      const row: ProductRow = {
        id: createId('product'),
        name: input.name,
        categoryId: input.categoryId ?? null,
        marketId: input.marketId,
        defaultUnit: input.defaultUnit,
        rating: input.rating ?? null,
        notes: input.notes ?? null,
        isFavorite: toSqlBoolean(input.isFavorite ?? false),
        imagePath: input.imagePath ?? null,
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
    async delete(id: string): Promise<void> {
      await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    },
  };
}
