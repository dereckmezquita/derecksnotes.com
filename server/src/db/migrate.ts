import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { config } from '@lib/env';
import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.dirname(config.databasePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory: ${dataDir}`);
}

const sqlite = new Database(config.databasePath);
const db = drizzle(sqlite);

const migrationsFolder = path.resolve(import.meta.dir, '../../drizzle');

try {
  console.log('Running database migrations...');
  migrate(db, { migrationsFolder });
  console.log('Migrations complete.');
} catch (error: any) {
  if (!error.message?.includes('No migrations')) {
    throw error;
  }
  console.log('No pending migrations.');
} finally {
  sqlite.close();
}
