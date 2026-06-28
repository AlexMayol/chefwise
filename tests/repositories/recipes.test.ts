import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createRecipeRepository, type RecipeRow } from '@/lib/db/repositories/recipes';

type Call = { sql: string; params?: SqlParameter[] };

function createDb(rows: RecipeRow[] = []) {
  const calls: Call[] = [];
  const db: AppDatabase & { calls: Call[] } = {
    calls,
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async <T,>() => (rows[0] ?? null) as T | null,
    getAllAsync: async <T,>() => rows as unknown as T[],
    runAsync: async (sql: string, params?: SqlParameter[]) => {
      calls.push({ sql, params });
      return { changes: 1 };
    },
    withTransactionAsync: async <T,>(work: () => Promise<T>) => work(),
    serializeAsync: async () => new Uint8Array(),
  };
  return db;
}

describe('recipe repository', () => {
  it('stores isFavorite as an integer and returns it as a boolean', async () => {
    const db = createDb();
    const recipe = await createRecipeRepository(db).create({
      name: 'Greek Salad',
      servings: 2,
      recipeCategoryId: 'recipe-category-1',
      isFavorite: true,
    });

    expect(recipe.isFavorite).toBe(true);
    expect(recipe.recipeCategoryId).toBe('recipe-category-1');
    const insert = db.calls.find((c) => c.sql.includes('INSERT INTO recipes'));
    expect(insert?.params).toContain(1); // isFavorite -> 1
  });

  it('defaults isFavorite to false and category to null', async () => {
    const db = createDb();
    const recipe = await createRecipeRepository(db).create({ name: 'Plain', servings: 1 });
    expect(recipe.isFavorite).toBe(false);
    expect(recipe.recipeCategoryId).toBeNull();
  });

  it('converts isFavorite to an integer on update', async () => {
    const db = createDb();
    await createRecipeRepository(db).update('recipe-1', { isFavorite: false });
    const update = db.calls.find((c) => c.sql.startsWith('UPDATE recipes'));
    expect(update?.params).toContain(0);
  });

  it('replaces all ingredients in one transaction', async () => {
    const db = createDb();
    await createRecipeRepository(db).setIngredients('recipe-1', [
      { productId: 'p1', quantity: 2, unit: 'unit' },
      { productId: 'p2', offerId: 'o2', quantity: 100, unit: 'g' },
    ]);

    const deletes = db.calls.filter((c) => c.sql.startsWith('DELETE FROM recipe_products'));
    const inserts = db.calls.filter((c) => c.sql.includes('INSERT INTO recipe_products'));
    expect(deletes).toHaveLength(1);
    expect(inserts).toHaveLength(2);
  });
});
