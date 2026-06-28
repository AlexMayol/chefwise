import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Recipe, RecipeInput, RecipeProduct, RecipeProductInput } from '@/lib/db/repositories/recipes';
import { calculateRecipeCost, calculateRecipeCosts, type RecipeCostPrice } from '@/lib/domain/recipes';
import { consumeRecipeBatch } from '@/lib/domain/pantry';
import { productEmoji } from '@/lib/ui/category-emoji';
import { useCollection } from './use-collection';
import { useDetail } from './use-detail';
import { usePantry } from './use-pantry';

// An ingredient list entry without the recipeId (it's implied by the recipe being saved).
type IngredientDraft = Omit<RecipeProductInput, 'recipeId'>;

export function useRecipes() {
  const { repositories } = useAppDatabase();
  const collection = useCollection<Recipe, RecipeInput>(repositories.recipes);

  // Create a recipe and its ingredients together (the guided form submits both at once).
  const createWithIngredients = useCallback(
    async (input: RecipeInput, ingredients: IngredientDraft[]): Promise<Recipe> => {
      const recipe = await repositories.recipes.create(input);
      if (ingredients.length > 0) {
        await repositories.recipes.setIngredients(recipe.id, ingredients);
      }
      await collection.reload();
      return recipe;
    },
    [collection.reload, repositories.recipes],
  );

  return { ...collection, createWithIngredients };
}

// A recipe enriched for the listing cards: cost (reusing the cost engine) + the emoji strip
// derived from each ingredient's product category. Loads everything once, computes in memory.
export type RecipeOverview = Recipe & {
  totalCost: number | null;
  costPerServing: number | null;
  complete: boolean;
  ingredientCount: number;
  ingredientEmojis: string[];
};

export function useRecipeOverviews() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<RecipeOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [recipes, products, categories, offers] = await Promise.all([
        repositories.recipes.list(),
        repositories.products.list(),
        repositories.categories.list(),
        repositories.productOffers.listAll(),
      ]);
      const ingredientLists = await Promise.all(recipes.map((recipe) => repositories.recipes.listIngredients(recipe.id)));

      const prices: RecipeCostPrice[] = offers
        .filter((offer) => offer.normalizedPrice != null && offer.normalizedUnit != null && offer.observedAt != null)
        .map((offer) => ({
          id: offer.id,
          offerId: offer.id,
          productId: offer.productId,
          normalizedPrice: offer.normalizedPrice!,
          normalizedUnit: offer.normalizedUnit!,
          observedAt: offer.observedAt!,
        }));

      const costs = calculateRecipeCosts(
        recipes.map((recipe, index) => ({ id: recipe.id, servings: recipe.servings, ingredients: ingredientLists[index] })),
        prices,
      );

      const categoryIdByProduct = new Map(products.map((product) => [product.id, product.categoryId]));

      setItems(
        recipes.map((recipe, index) => {
          const ingredients = ingredientLists[index];
          const cost = costs[recipe.id];
          return {
            ...recipe,
            totalCost: cost.totalCost,
            costPerServing: cost.costPerServing,
            complete: cost.complete,
            ingredientCount: ingredients.length,
            ingredientEmojis: ingredients.map((ingredient) =>
              productEmoji(categoryIdByProduct.get(ingredient.productId) ?? null, categories),
            ),
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [repositories]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggleFavorite = useCallback(
    async (id: string, value: boolean) => {
      await repositories.recipes.update(id, { isFavorite: value });
      await reload();
    },
    [reload, repositories.recipes],
  );

  return { items, loading, reload, toggleFavorite };
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

  // Save edits to the recipe and its full ingredient list (the guided edit form submits both).
  const save = useCallback(
    async (input: Partial<RecipeInput>, newIngredients?: Omit<RecipeProductInput, 'recipeId'>[]) => {
      if (!recipeId) {
        return;
      }
      await repositories.recipes.update(recipeId, input);
      if (newIngredients) {
        await repositories.recipes.setIngredients(recipeId, newIngredients);
      }
      await reload();
    },
    [recipeId, reload, repositories.recipes],
  );

  const toggleFavorite = useCallback(async () => {
    if (!recipeId || !recipe) {
      return;
    }
    await repositories.recipes.update(recipeId, { isFavorite: !recipe.isFavorite });
    await reload();
  }, [recipe, recipeId, reload, repositories.recipes]);

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

  return { recipe, ingredients, loading, reload, addIngredient, save, toggleFavorite, calculateCost: cost, cook, remove };
}
