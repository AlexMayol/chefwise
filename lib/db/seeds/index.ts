import type { AppDatabase } from '../client';
import { seedDefaultCategories } from './categories';
import { seedDevData } from './dev';

// Runs once on fresh install. Add new seeds to this list.
export async function runSeeds(db: AppDatabase): Promise<void> {
  await seedDefaultCategories(db);
  // ponytail: __DEV__ gate — sample markets/products in dev/test only, never in release builds.
  if (__DEV__) {
    await seedDevData(db);
  }
}
