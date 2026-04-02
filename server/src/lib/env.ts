import path from 'path';
import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV = (process.env.BUILD_ENV as BuildEnv) || 'local';

// Resolve local DB path relative to the server directory (import.meta.dir)
const SERVER_DIR = path.resolve(import.meta.dir, '../..');

const SERVER_ENV_CONFIG = {
    local: {
        databasePath: path.join(SERVER_DIR, 'data', 'database.sqlite'),
        secureCookies: false
    },
    dev: {
        databasePath: '/app/data/database.sqlite',
        secureCookies: true
    },
    prod: {
        databasePath: '/app/data/database.sqlite',
        secureCookies: true
    }
} as const;

const derived = { ...ENV_CONFIG[BUILD_ENV], ...SERVER_ENV_CONFIG[BUILD_ENV] };

export const config = {
    buildEnv: BUILD_ENV,
    port: parseInt(process.env.PORT || '3001', 10),
    domain: process.env.DOMAIN || derived.domain,
    baseUrl: process.env.BASE_URL || derived.baseUrl,
    apiUrl: process.env.API_URL || derived.apiUrl,
    databasePath: process.env.DATABASE_PATH || derived.databasePath,
    secureCookies: derived.secureCookies,
    adminUsername: process.env.ADMIN_USERNAME || null
};

export const secrets = {
    sessionSecret: requireEnv('SESSION_SECRET')
};

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        if (BUILD_ENV === 'local') {
            console.warn(
                `Warning: Missing ${name} — using placeholder for local dev`
            );
            return 'local-dev-placeholder';
        }
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
