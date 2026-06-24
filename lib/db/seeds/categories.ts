import type { AppDatabase } from '../client';
import { getDeviceDefaultLocale } from '@/lib/i18n';
import { createId, nowIso } from '../repositories/base';
import { DEFAULT_CATEGORIES } from './categories-data';

export async function seedDefaultCategories(db: AppDatabase): Promise<void> {
  const timestamp = nowIso();
  const categories = DEFAULT_CATEGORIES[getDeviceDefaultLocale()];

  for (const { name, description } of categories) {
    await db.runAsync(
      'INSERT INTO categories (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [createId('category'), name, description, timestamp, timestamp],
    );
  }
}
