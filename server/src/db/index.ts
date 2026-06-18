import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { config } from '@lib/env';
import * as path from 'path';
import * as fs from 'fs';
import * as schema from './schema';

// Ensure the parent directory exists before opening — otherwise SQLite
// throws SQLITE_CANTOPEN on first import in any context that doesn't
// pre-create it (CI runners, fresh dev clones, ephemeral containers).
// The same mkdir lived in server/src/index.ts; pulling it here means any
// caller of @db/index (tests, scripts) gets it for free.
const dbDir = path.dirname(config.databasePath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

export const sqlite = new Database(config.databasePath);
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });

// Run migrations on startup (creates tables on fresh DB, applies new migrations on existing)
try {
  const migrationsFolder = path.resolve(import.meta.dir, '../../drizzle');
  migrate(db, { migrationsFolder });
  console.log('Database migrations applied.');
} catch (error: any) {
  if (!error.message?.includes('No migrations')) {
    throw error;
  }
}

export { schema };
