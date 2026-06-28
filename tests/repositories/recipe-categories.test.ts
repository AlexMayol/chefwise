import type { AppDatabase, SqlParameter } from '@/lib/db/client';
import { createRecipeCategoryRepository } from '@/lib/db/repositories/recipe-categories';

type Inserted = { sql: string; params?: SqlParameter[] };

function createDb(maxOrder: number | null = null) {
  const inserts: Inserted[] = [];
  const db: AppDatabase & { lastListSql?: string; inserts: Inserted[] } = {
    inserts,
    execAsync: jest.fn(async () => undefined),
    getFirstAsync: async <T,>() => ({ maxOrder } as T),
    getAllAsync: async <T,>(sql: string) => {
      db.lastListSql = sql;
      return [] as T[];
    },
    runAsync: async (sql: string, params?: SqlParameter[]) => {
      inserts.push({ sql, params });
      return { changes: 1 };
    },
    withTransactionAsync: async <T,>(work: () => Promise<T>) => work(),
    serializeAsync: async () => new Uint8Array(),
  };
  return db;
}

describe('recipe category repository', () => {
  it('lists categories ordered by sortOrder then createdAt', async () => {
    const db = createDb();
    await createRecipeCategoryRepository(db).list();
    expect(db.lastListSql).toContain('ORDER BY sortOrder ASC, createdAt ASC');
  });

  it('assigns the first category sortOrder 0 when the table is empty', async () => {
    const db = createDb(null);
    const category = await createRecipeCategoryRepository(db).create({ name: 'Soups', emoji: '🥣' });
    expect(category.sortOrder).toBe(0);
    expect(category.emoji).toBe('🥣');
  });

  it('appends new categories after the current max sortOrder', async () => {
    const db = createDb(4);
    const category = await createRecipeCategoryRepository(db).create({ name: 'Soups' });
    expect(category.sortOrder).toBe(5);
    expect(category.emoji).toBeNull();
    expect(category.description).toBeNull();
  });
});
