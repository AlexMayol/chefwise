import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createId, fromSqlBoolean, insertRow, nowIso, toSqlBoolean, updateRow } from './base';

export type Product = {
  id: string;
  name: string;
  categoryId: string | null;
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

export type ProductInput = {
  name: string;
  categoryId?: string | null;
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
    async list(options: { favoritesOnly?: boolean; minRating?: number; sort?: ProductSort } = {}): Promise<Product[]> {
      const clauses: string[] = [];
      const params: number[] = [];

      if (options.favoritesOnly) {
        clauses.push('isFavorite = 1');
      }

      if (options.minRating) {
        clauses.push('rating >= ?');
        params.push(options.minRating);
      }

      const orderBy =
        options.sort === 'highest_rated'
          ? 'rating DESC, name COLLATE NOCASE ASC'
          : options.sort === 'lowest_rated'
            ? 'rating ASC, name COLLATE NOCASE ASC'
            : options.sort === 'favorites_first'
              ? 'isFavorite DESC, name COLLATE NOCASE ASC'
              : 'name COLLATE NOCASE ASC';

      const rows = await db.getAllAsync<ProductRow>(
        `SELECT * FROM products${clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''} ORDER BY ${orderBy}`,
        params,
      );
      return rows.map(mapProduct);
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
