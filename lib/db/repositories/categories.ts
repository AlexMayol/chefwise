import type { AppDatabase } from '../client';
import { createCrudRepository } from './base';

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = {
  name: string;
};

export function createCategoryRepository(db: AppDatabase) {
  return createCrudRepository<Category, CategoryInput>(db, 'categories', 'category');
}
