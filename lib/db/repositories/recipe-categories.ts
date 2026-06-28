import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso } from './base';

export type RecipeCategory = {
  id: string;
  name: string;
  emoji: string | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RecipeCategoryInput = {
  name: string;
  emoji?: string | null;
  description?: string | null;
};

export function createRecipeCategoryRepository(db: AppDatabase) {
  // getById/update/delete come from the base; list + create are custom for the sortOrder
  // column (seeded order, no reorder UI in v1 — new categories just append to the end).
  const base = createCrudRepository<RecipeCategory, RecipeCategoryInput>(db, 'recipe_categories', 'recipe-category');

  return {
    ...base,
    async list(): Promise<RecipeCategory[]> {
      return db.getAllAsync<RecipeCategory>(
        'SELECT * FROM recipe_categories ORDER BY sortOrder ASC, createdAt ASC',
      );
    },
    async create(input: RecipeCategoryInput): Promise<RecipeCategory> {
      const timestamp = nowIso();
      const max = await db.getFirstAsync<{ maxOrder: number | null }>(
        'SELECT MAX(sortOrder) AS maxOrder FROM recipe_categories',
      );
      const row: RecipeCategory = {
        id: createId('recipe-category'),
        name: input.name,
        emoji: input.emoji ?? null,
        description: input.description ?? null,
        sortOrder: (max?.maxOrder ?? -1) + 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'recipe_categories', row);
      return row;
    },
  };
}
