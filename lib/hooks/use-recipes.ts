import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Recipe, RecipeInput, RecipeProduct, RecipeProductInput } from '@/lib/db/repositories/recipes';
import { calculateRecipeCost } from '@/lib/domain/recipes';
import { consumeRecipeBatch } from '@/lib/domain/pantry';
import { usePantry } from './use-pantry';

export function useRecipes() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.recipes.list());
    } finally {
      setLoading(false);
    }
  }, [repositories.recipes]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: RecipeInput) => {
      const recipe = await repositories.recipes.create(input);
      await reload();
      return recipe;
    },
    [reload, repositories.recipes],
  );

  const addIngredient = useCallback(
    async (input: RecipeProductInput): Promise<RecipeProduct> => repositories.recipes.addIngredient(input),
    [repositories.recipes],
  );

  return { items, loading, reload, create, addIngredient };
}

export function useRecipeDetail(recipeId?: string) {
  const { repositories } = useAppDatabase();
  const pantry = usePantry();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeProduct[]>([]);
  const [loading, setLoading] = useState(Boolean(recipeId));

  const reload = useCallback(async () => {
    if (!recipeId) {
      setRecipe(null);
      setIngredients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setRecipe(await repositories.recipes.getById(recipeId));
      setIngredients(await repositories.recipes.listIngredients(recipeId));
    } finally {
      setLoading(false);
    }
  }, [recipeId, repositories.recipes]);

  useEffect(() => {
    void reload();
  }, [reload]);

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

    const prices = (
      await Promise.all(ingredients.map((ingredient) => repositories.productPrices.listForProduct(ingredient.productId)))
    ).flat();

    return calculateRecipeCost({
      servings: recipe.servings,
      ingredients,
      prices,
    });
  }, [ingredients, recipe, repositories.productPrices]);

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
