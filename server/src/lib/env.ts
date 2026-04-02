import path from 'path';
import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV = (process.env.BUILD_ENV as BuildEnv) || 'local';
const SERVER_DIR = path.resolve(import.meta.dir, '../..');

const SERVER_CONFIG = {
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

const derived = ENV_CONFIG[BUILD_ENV];
const serverDerived = SERVER_CONFIG[BUILD_ENV];

export const config = {
    buildEnv: BUILD_ENV,
    isProduction: BUILD_ENV === 'prod',
    port: parseInt(process.env.PORT || '3001', 10),
    domain: derived.domain,
    baseUrl: derived.baseUrl,
    apiUrl: derived.apiUrl,
    databasePath: process.env.DATABASE_PATH || serverDerived.databasePath,
    secureCookies: serverDerived.secureCookies,
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
