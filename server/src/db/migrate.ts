import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { config } from '../lib/env';
import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.dirname(config.databasePath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(config.databasePath);
const db = drizzle(sqlite);

console.log('Running migrations...');
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations completed successfully!');

sqlite.close();
