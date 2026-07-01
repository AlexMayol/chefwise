import type { AppDatabase } from '../client';
import { seedDefaultCategories } from './categories';
import { seedDevData } from './dev';

// Runs once on fresh install. Add new seeds to this list.
export async function runSeeds(db: AppDatabase): Promise<void> {
  await seedDefaultCategories(db);
  // ponytail: __DEV__ gate — sample markets/products in dev/test only, never in release builds.
  // EXPO_PUBLIC_SKIP_SEED lets `npm run start:no-seed` opt out of the dev-only sample data.
  if (__DEV__ && !process.env.EXPO_PUBLIC_SKIP_SEED) {
    await seedDevData(db);
  }
}
