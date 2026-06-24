import type { AppDatabase } from './client';
import { LATEST_SCHEMA_VERSION, SCHEMA_SQL } from './schema';

type UserVersionRow = {
  user_version: number;
};

async function getUserVersion(db: AppDatabase): Promise<number> {
  const row = await db.getFirstAsync<UserVersionRow>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

export async function runMigrations(db: AppDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON');

  const currentVersion = await getUserVersion(db);

  if (currentVersion < 1) {
    await db.execAsync(SCHEMA_SQL);
    await db.execAsync(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION}`);
  }
}
