import { useAppDatabase } from '@/lib/db/provider';
import type { RecipeCategory, RecipeCategoryInput } from '@/lib/db/repositories/recipe-categories';

import { useCollection } from './use-collection';

export function useRecipeCategories() {
  return useCollection<RecipeCategory, RecipeCategoryInput>(useAppDatabase().repositories.recipeCategories);
}
