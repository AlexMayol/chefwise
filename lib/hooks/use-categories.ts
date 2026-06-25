import { useAppDatabase } from '@/lib/db/provider';
import type { Category, CategoryInput } from '@/lib/db/repositories/categories';

import { useCollection } from './use-collection';

export function useCategories() {
  return useCollection<Category, CategoryInput>(useAppDatabase().repositories.categories);
}
