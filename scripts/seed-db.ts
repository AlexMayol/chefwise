// Build a fresh, seeded chefwise.sqlite from the real schema + seed data.
// Run: npm run seed:db -- [outPath] [--lang en|es] [--force]
//
// Note: this creates a brand-new DB, so it applies the full current schema
// (which already includes every migrated column) and skips the ALTER-based
// upgrade steps in lib/db/migrations.ts — those only matter for upgrading an
// existing on-device database, not for a from-scratch file.
import { existsSync, rmSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

import { LATEST_SCHEMA_VERSION, SCHEMA_SQL } from '../lib/db/schema.ts';
import { createId, nowIso } from '../lib/db/repositories/base.ts';
import { DEFAULT_CATEGORIES } from '../lib/db/seeds/categories-data.ts';

const args = process.argv.slice(2);
const force = args.includes('--force');
const langArg = args[args.indexOf('--lang') + 1];
const lang: 'en' | 'es' = langArg === 'en' ? 'en' : 'es';
const outPath = args.find((a) => !a.startsWith('--') && a !== langArg) ?? './chefwise.dev.sqlite';

if (existsSync(outPath)) {
  if (!force) {
    console.error(`${outPath} already exists. Pass --force to overwrite.`);
    process.exit(1);
  }
  rmSync(outPath);
}

const db = new DatabaseSync(outPath);
db.exec('PRAGMA foreign_keys = ON');

// Migrations: fresh schema is already at the latest version.
db.exec(SCHEMA_SQL);
db.exec(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION}`);

// Seeders.
const timestamp = nowIso();
const insertCategory = db.prepare(
  'INSERT INTO categories (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
);
for (const { name, description } of DEFAULT_CATEGORIES[lang]) {
  insertCategory.run(createId('category'), name, description, timestamp, timestamp);
}

db.close();
console.log(`Seeded ${DEFAULT_CATEGORIES[lang].length} categories (${lang}) into ${outPath} (schema v${LATEST_SCHEMA_VERSION}).`);
