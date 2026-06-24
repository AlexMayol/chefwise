import { normalizePrice } from '@/lib/domain/pricing';
import type { NormalizedUnit, Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createId, insertRow, nowIso } from './base';

export type ProductPrice = {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  quantity: number;
  unit: Unit;
  normalizedPrice: number;
  normalizedUnit: NormalizedUnit;
  observedAt: string;
  createdAt: string;
};

export type ProductPriceInput = {
  productId: string;
  marketId: string;
  price: number;
  quantity: number;
  unit: Unit;
  observedAt: string;
};

export function createProductPriceRepository(db: AppDatabase) {
  return {
    async create(input: ProductPriceInput): Promise<ProductPrice> {
      const normalized = normalizePrice(input);
      const row: ProductPrice = {
        id: createId('price'),
        ...input,
        ...normalized,
        createdAt: nowIso(),
      };

      return insertRow(db, 'product_prices', row);
    },
    async listForProduct(productId: string): Promise<ProductPrice[]> {
      return db.getAllAsync<ProductPrice>(
        'SELECT * FROM product_prices WHERE productId = ? ORDER BY observedAt DESC, id DESC',
        [productId],
      );
    },
    async latestForProduct(productId: string, marketId?: string): Promise<ProductPrice | null> {
      const marketClause = marketId ? ' AND marketId = ?' : '';
      const params = marketId ? [productId, marketId] : [productId];
      return db.getFirstAsync<ProductPrice>(
        `SELECT * FROM product_prices WHERE productId = ?${marketClause} ORDER BY observedAt DESC, id DESC LIMIT 1`,
        params,
      );
    },
  };
}
