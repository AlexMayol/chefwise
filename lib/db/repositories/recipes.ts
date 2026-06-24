import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, insertRow, nowIso } from './base';

export type PricingStrategy = 'manual' | 'cheapest_available';

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  pricingStrategy: PricingStrategy;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecipeInput = {
  name: string;
  description?: string | null;
  servings: number;
  pricingStrategy: PricingStrategy;
  imagePath?: string | null;
};

export type RecipeProduct = {
  id: string;
  recipeId: string;
  productId: string;
  quantity: number;
  unit: Unit;
  createdAt: string;
  updatedAt: string;
};

export type RecipeProductInput = {
  recipeId: string;
  productId: string;
  quantity: number;
  unit: Unit;
  marketId?: string | null;
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
    async listManualMarkets(recipeProductId: string): Promise<{ marketId: string }[]> {
      return db.getAllAsync<{ marketId: string }>(
        'SELECT marketId FROM recipe_product_markets WHERE recipeProductId = ?',
        [recipeProductId],
      );
    },
    async addIngredient(input: RecipeProductInput): Promise<RecipeProduct> {
      const timestamp = nowIso();
      const ingredient: RecipeProduct = {
        id: createId('recipe-product'),
        recipeId: input.recipeId,
        productId: input.productId,
        quantity: input.quantity,
        unit: input.unit,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await db.withTransactionAsync(async () => {
        await insertRow(db, 'recipe_products', ingredient);

        if (input.marketId) {
          await insertRow(db, 'recipe_product_markets', {
            id: createId('recipe-product-market'),
            recipeProductId: ingredient.id,
            marketId: input.marketId,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
      });

      return ingredient;
    },
    async removeIngredient(id: string): Promise<void> {
      await db.runAsync('DELETE FROM recipe_products WHERE id = ?', [id]);
    },
  };
}
