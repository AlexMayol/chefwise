import * as SQLite from 'expo-sqlite';

export const APP_DATABASE_NAME = 'chefwise.sqlite';
export const APP_DATABASE_DIRECTORY = SQLite.defaultDatabaseDirectory as string | undefined;

export type SqlParameter = string | number | null | boolean;

export type RunResult = {
  changes: number;
  lastInsertRowId?: number;
};

export type AppDatabase = {
  execAsync(sql: string): Promise<void>;
  getFirstAsync<T>(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>): Promise<T | null>;
  getAllAsync<T>(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>): Promise<T[]>;
  runAsync(sql: string, params?: SqlParameter[] | Record<string, SqlParameter>): Promise<RunResult>;
  withTransactionAsync<T>(work: () => Promise<T>): Promise<T>;
};

export async function openAppDatabase(): Promise<AppDatabase> {
  const db = await SQLite.openDatabaseAsync(APP_DATABASE_NAME);
  await db.execAsync('PRAGMA foreign_keys = ON');
  return db as AppDatabase;
}
