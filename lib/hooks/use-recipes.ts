import { useCallback } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Recipe, RecipeInput, RecipeProduct, RecipeProductInput } from '@/lib/db/repositories/recipes';
import { calculateRecipeCost } from '@/lib/domain/recipes';
import { consumeRecipeBatch } from '@/lib/domain/pantry';
import { useCollection } from './use-collection';
import { useDetail } from './use-detail';
import { usePantry } from './use-pantry';

export function useRecipes() {
  const { repositories } = useAppDatabase();
  const collection = useCollection<Recipe, RecipeInput>(repositories.recipes);

  const addIngredient = useCallback(
    async (input: RecipeProductInput): Promise<RecipeProduct> => repositories.recipes.addIngredient(input),
    [repositories.recipes],
  );

  return { ...collection, addIngredient };
}

export function useRecipeDetail(recipeId?: string) {
  const { repositories } = useAppDatabase();
  const pantry = usePantry();
  const loadRecipe = useCallback((id: string) => repositories.recipes.getById(id), [repositories.recipes]);
  const loadIngredients = useCallback((id: string) => repositories.recipes.listIngredients(id), [repositories.recipes]);
  const recipeState = useDetail<Recipe | null>(recipeId, loadRecipe, null);
  const ingredientsState = useDetail<RecipeProduct[]>(recipeId, loadIngredients, []);
  const recipe = recipeState.item;
  const ingredients = ingredientsState.item;
  const loading = recipeState.loading || ingredientsState.loading;

  const reload = useCallback(async () => {
    await Promise.all([recipeState.reload(), ingredientsState.reload()]);
  }, [recipeState.reload, ingredientsState.reload]);

  const addIngredient = useCallback(
    async (input: RecipeProductInput) => {
      const ingredient = await repositories.recipes.addIngredient(input);
      await reload();
      return ingredient;
    },
    [reload, repositories.recipes],
  );

  const cost = useCallback(async () => {
    if (!recipe) {
      return null;
    }

    // One candidate per offer = that offer's latest price. The domain layer picks the
    // ingredient's chosen offer, or the cheapest, from these.
    const offerLists = await Promise.all(
      ingredients.map((ingredient) => repositories.productOffers.listForProduct(ingredient.productId)),
    );
    const prices = offerLists
      .flat()
      .filter((offer) => offer.normalizedPrice != null && offer.normalizedUnit != null && offer.observedAt != null)
      .map((offer) => ({
        id: offer.id,
        offerId: offer.id,
        productId: offer.productId,
        normalizedPrice: offer.normalizedPrice!,
        normalizedUnit: offer.normalizedUnit!,
        observedAt: offer.observedAt!,
      }));

    return calculateRecipeCost({
      servings: recipe.servings,
      ingredients,
      prices,
    });
  }, [ingredients, recipe, repositories.productOffers]);

  const remove = useCallback(async () => {
    if (!recipeId) {
      return;
    }

    await repositories.recipes.delete(recipeId);
  }, [recipeId, repositories.recipes]);

  const cook = useCallback(async () => {
    const result = consumeRecipeBatch({
      pantryItems: pantry.items,
      ingredients,
    });

    if (!result.ok) {
      throw new Error(`pantry.missing:${result.missingProductIds.join(',')}`);
    }

    for (const ingredient of ingredients) {
      await pantry.adjust({
        productId: ingredient.productId,
        type: 'consume',
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        note: recipe?.name ?? null,
      });
    }
  }, [ingredients, pantry, recipe?.name]);

  return { recipe, ingredients, loading, reload, addIngredient, calculateCost: cost, cook, remove };
}
