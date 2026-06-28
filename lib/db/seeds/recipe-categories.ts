import { getDeviceDefaultLocale } from '@/lib/i18n';

import type { AppDatabase } from '../client';
import { createId, nowIso } from '../repositories/base';
import { DEFAULT_RECIPE_CATEGORIES } from './recipe-categories-data';

// Called from the v9 migration block (gated on currentVersion < 9), so it runs once for
// both fresh installs and existing dev DBs. sortOrder = seed index keeps the listed order stable.
export async function seedDefaultRecipeCategories(db: AppDatabase): Promise<void> {
  const timestamp = nowIso();
  const categories = DEFAULT_RECIPE_CATEGORIES[getDeviceDefaultLocale()];

  for (const [index, { name, emoji }] of categories.entries()) {
    await db.runAsync(
      'INSERT INTO recipe_categories (id, name, emoji, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [createId('recipe-category'), name, emoji, null, index, timestamp, timestamp],
    );
  }
}
