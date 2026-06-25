import type { AppDatabase } from '../client';
import { getDeviceDefaultLocale } from '@/lib/i18n';
import { createId, nowIso } from '../repositories/base';
import { DEFAULT_CATEGORIES } from './categories-data';
import { DEFAULT_MARKETS } from './markets-data';
import { DEFAULT_PRODUCTS } from './products-data';

// Sample markets + products for development. Gated behind __DEV__ in seeds/index.ts so it
// never runs in release builds.
export async function seedDevData(db: AppDatabase): Promise<void> {
  const timestamp = nowIso();
  const locale = getDeviceDefaultLocale();

  const marketIds = DEFAULT_MARKETS[locale].map(() => createId('market'));
  for (const [i, { name, address }] of DEFAULT_MARKETS[locale].entries()) {
    await db.runAsync(
      'INSERT INTO markets (id, name, address, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [marketIds[i], name, address, timestamp, timestamp],
    );
  }

  // Resolve categoryIndex -> seeded category id by name (createId is random and all
  // categories share one createdAt, so insertion order can't be recovered via ORDER BY).
  const categoryRows = await db.getAllAsync<{ id: string; name: string }>('SELECT id, name FROM categories');
  const categoryIdByName = new Map(categoryRows.map((r) => [r.name, r.id]));
  const categoryNames = DEFAULT_CATEGORIES[locale];

  for (const product of DEFAULT_PRODUCTS[locale]) {
    const categoryName = categoryNames[product.categoryIndex]?.name;
    await db.runAsync(
      'INSERT INTO products (id, name, categoryId, marketId, defaultUnit, rating, notes, isFavorite, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        createId('product'),
        product.name,
        (categoryName && categoryIdByName.get(categoryName)) ?? null,
        marketIds[product.marketIndex],
        product.defaultUnit,
        product.rating,
        product.notes,
        product.isFavorite ? 1 : 0,
        timestamp,
        timestamp,
      ],
    );
  }
}
