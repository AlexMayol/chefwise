import type { AppDatabase } from '../client';
import { createCrudRepository } from './base';

export type Market = {
  id: string;
  name: string;
  address: string | null;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MarketInput = {
  name: string;
  address?: string | null;
  imagePath?: string | null;
};

export function createMarketRepository(db: AppDatabase) {
  return createCrudRepository<Market, MarketInput>(db, 'markets', 'market');
}
