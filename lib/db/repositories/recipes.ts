import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso } from './base';

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecipeInput = {
  name: string;
  description?: string | null;
  servings: number;
  imagePath?: string | null;
};

export type RecipeProduct = {
  id: string;
  recipeId: string;
  productId: string;
  // Chosen offer to cost this ingredient against; null = use the cheapest current offer.
  offerId: string | null;
  quantity: number;
  unit: Unit;
  createdAt: string;
  updatedAt: string;
};

export type RecipeProductInput = {
  recipeId: string;
  productId: string;
  offerId?: string | null;
  quantity: number;
  unit: Unit;
};

export function createRecipeRepository(db: AppDatabase) {
  const recipes = createCrudRepository<Recipe, RecipeInput>(db, 'recipes', 'recipe');

  return {
    ...recipes,
    async listIngredients(recipeId: string): Promise<RecipeProduct[]> {
      return db.getAllAsync<RecipeProduct>('SELECT * FROM recipe_products WHERE recipeId = ? ORDER BY createdAt ASC', [
        recipeId,
      ]);
    },
    async addIngredient(input: RecipeProductInput): Promise<RecipeProduct> {
      const timestamp = nowIso();
      const ingredient: RecipeProduct = {
        id: createId('recipe-product'),
        recipeId: input.recipeId,
        productId: input.productId,
        offerId: input.offerId ?? null,
        quantity: input.quantity,
        unit: input.unit,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'recipe_products', ingredient);
      return ingredient;
    },
    async removeIngredient(id: string): Promise<void> {
      await db.runAsync('DELETE FROM recipe_products WHERE id = ?', [id]);
    },
  };
}
