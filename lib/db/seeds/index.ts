import type { AppDatabase } from '../client';
import { seedDefaultCategories } from './categories';

// Runs once on fresh install. Add new seeds to this list.
export async function runSeeds(db: AppDatabase): Promise<void> {
  await seedDefaultCategories(db);
}
