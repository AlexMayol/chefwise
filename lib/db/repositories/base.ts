import type { AppDatabase, SqlParameter } from '../client';

export type TimestampedEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export function nowIso(): string {
  return new Date().toISOString();
}

type UuidCrypto = {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint8Array) => Uint8Array;
};

function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  const crypto = globalThis.crypto as UuidCrypto | undefined;

  if (crypto?.getRandomValues) {
    return crypto.getRandomValues(bytes);
  }

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

function createUuid(): string {
  const crypto = globalThis.crypto as UuidCrypto | undefined;

  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  const bytes = getRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

export function createId(prefix: string): string {
  return `${prefix}-${createUuid()}`;
}

export function toSqlBoolean(value: boolean): number {
  return value ? 1 : 0;
}

export function fromSqlBoolean(value: number): boolean {
  return value === 1;
}

export async function insertRow<T extends Record<string, unknown>>(
  db: AppDatabase,
  table: string,
  row: T,
): Promise<T> {
  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((key) => row[key] as SqlParameter);

  await db.runAsync(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, values);
  return row;
}

export async function updateRow<T extends Record<string, unknown>>(
  db: AppDatabase,
  table: string,
  id: string,
  patch: Partial<T>,
): Promise<void> {
  const keys = Object.keys(patch);

  if (keys.length === 0) {
    return;
  }

  const assignments = keys.map((key) => `${key} = ?`).join(', ');
  const values = [...keys.map((key) => patch[key] as SqlParameter), id];
  await db.runAsync(`UPDATE ${table} SET ${assignments} WHERE id = ?`, values);
}

// `mapRow` converts a raw DB row to the model (e.g. SQLite int -> boolean). Omit it
// when the row already matches the model (the markets/categories case). `Row` is the
// stored shape; it defaults to `T` so existing callers need no extra type argument.
export function createCrudRepository<
  T extends { id: string },
  CreateInput extends Record<string, unknown>,
  Row = T,
>(db: AppDatabase, table: string, prefix: string, mapRow?: (row: Row) => T) {
  const map = mapRow ?? ((row: Row) => row as unknown as T);

  return {
    async list(): Promise<T[]> {
      const rows = await db.getAllAsync<Row>(`SELECT * FROM ${table} ORDER BY createdAt DESC`);
      return rows.map(map);
    },
    async getById(id: string): Promise<T | null> {
      const row = await db.getFirstAsync<Row>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return row ? map(row) : null;
    },
    async create(input: CreateInput): Promise<T> {
      const timestamp = nowIso();
      const row = {
        id: createId(prefix),
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as unknown as Row & Record<string, unknown>;

      await insertRow(db, table, row);
      return map(row);
    },
    async update(id: string, input: Partial<CreateInput>): Promise<void> {
      await updateRow(db, table, id, { ...input, updatedAt: nowIso() });
    },
    async delete(id: string): Promise<void> {
      await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [id]);
    },
  };
}
