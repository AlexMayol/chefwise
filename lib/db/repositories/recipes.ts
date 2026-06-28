import type { Unit } from '@/lib/domain/units';

import type { AppDatabase } from '../client';
import { createCrudRepository, createId, fromSqlBoolean, insertRow, nowIso, toSqlBoolean, updateRow } from './base';

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  recipeCategoryId: string | null;
  isFavorite: boolean;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecipeRow = Omit<Recipe, 'isFavorite'> & {
  isFavorite: number;
};

export type RecipeInput = {
  name: string;
  description?: string | null;
  servings: number;
  recipeCategoryId?: string | null;
  isFavorite?: boolean;
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

function mapRecipe(row: RecipeRow): Recipe {
  return { ...row, isFavorite: fromSqlBoolean(row.isFavorite) };
}

export function createRecipeRepository(db: AppDatabase) {
  // getById/list/delete come from the base with the boolean row mapper; create/update stay
  // custom for the isFavorite int<->bool conversion (same pattern as products).
  const recipes = createCrudRepository<Recipe, RecipeInput, RecipeRow>(db, 'recipes', 'recipe', mapRecipe);

  return {
    ...recipes,
    async create(input: RecipeInput): Promise<Recipe> {
      const timestamp = nowIso();
      const row: RecipeRow = {
        id: createId('recipe'),
        name: input.name,
        description: input.description ?? null,
        servings: input.servings,
        recipeCategoryId: input.recipeCategoryId ?? null,
        isFavorite: toSqlBoolean(input.isFavorite ?? false),
        imagePath: input.imagePath ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await insertRow(db, 'recipes', row);
      return mapRecipe(row);
    },
    async update(id: string, input: Partial<RecipeInput>): Promise<void> {
      const patch = {
        ...input,
        ...(input.isFavorite === undefined ? {} : { isFavorite: toSqlBoolean(input.isFavorite) }),
        updatedAt: nowIso(),
      };
      await updateRow(db, 'recipes', id, patch);
    },
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
    // Replace a recipe's full ingredient list in one transaction (used by the edit flow:
    // simpler and less bug-prone than diffing add/remove/update against the existing rows).
    async setIngredients(recipeId: string, inputs: Omit<RecipeProductInput, 'recipeId'>[]): Promise<void> {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM recipe_products WHERE recipeId = ?', [recipeId]);
        const timestamp = nowIso();
        for (const input of inputs) {
          await insertRow(db, 'recipe_products', {
            id: createId('recipe-product'),
            recipeId,
            productId: input.productId,
            offerId: input.offerId ?? null,
            quantity: input.quantity,
            unit: input.unit,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
      });
    },
  };
}
