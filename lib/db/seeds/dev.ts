import type { AppDatabase } from '../client';
import { getDeviceDefaultLocale } from '@/lib/i18n';
import { normalizePrice } from '@/lib/domain/pricing';
import type { Unit } from '@/lib/domain/units';
import { createId, nowIso } from '../repositories/base';
import { DEFAULT_CATEGORIES } from './categories-data';
import { DEFAULT_MARKETS } from './markets-data';
import { DEFAULT_PRODUCTS } from './products-data';

// A sensible seed offer size: 500 g/ml for those units, otherwise a single kg/l/unit.
function offerQuantity(unit: Unit): number {
  return unit === 'g' || unit === 'ml' ? 500 : 1;
}

async function seedOffer(
  db: AppDatabase,
  offer: {
    productId: string;
    marketId: string;
    brand: string | null;
    quantity: number;
    unit: Unit;
    price: number;
    rating?: number | null;
    description?: string | null;
    timestamp: string;
  },
): Promise<void> {
  const normalized = normalizePrice({ price: offer.price, quantity: offer.quantity, unit: offer.unit });
  await db.runAsync(
    'INSERT INTO product_offers (id, productId, marketId, brand, quantity, unit, rating, imagePath, description, price, normalizedPrice, normalizedUnit, observedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      createId('offer'),
      offer.productId,
      offer.marketId,
      offer.brand,
      offer.quantity,
      offer.unit,
      offer.rating ?? null,
      null,
      offer.description ?? null,
      offer.price,
      normalized.normalizedPrice,
      normalized.normalizedUnit,
      offer.timestamp,
      offer.timestamp,
      offer.timestamp,
    ],
  );
}

// Sample markets + products (with offers) for development. Gated behind __DEV__ in
// seeds/index.ts so it never runs in release builds.
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

  const products = DEFAULT_PRODUCTS[locale];
  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const categoryName = categoryNames[product.categoryIndex]?.name;
    const productId = createId('product');
    await db.runAsync(
      'INSERT INTO products (id, name, categoryId, defaultUnit, isFavorite, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        productId,
        product.name,
        (categoryName && categoryIdByName.get(categoryName)) ?? null,
        product.defaultUnit,
        product.isFavorite ? 1 : 0,
        timestamp,
        timestamp,
      ],
    );

    const quantity = offerQuantity(product.defaultUnit);
    const price = 1 + (index % 9) * 0.5;
    // Rating/notes describe the product at a market now, so they seed its first offer.
    await seedOffer(db, {
      productId,
      marketId: marketIds[product.marketIndex],
      brand: null,
      quantity,
      unit: product.defaultUnit,
      price,
      rating: product.rating,
      description: product.notes,
      timestamp,
    });

    // Demo multi-market comparison: give the first two products a second, pricier offer
    // (a named brand) in a different market.
    if (index < 2) {
      await seedOffer(db, {
        productId,
        marketId: marketIds[(product.marketIndex + 1) % marketIds.length],
        brand: 'Brand B',
        quantity,
        unit: product.defaultUnit,
        price: price + 0.4,
        timestamp,
      });
    }
  }
}
