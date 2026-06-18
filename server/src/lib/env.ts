import path from 'path';
import { ENV_CONFIG, type AppEnv } from '@derecksnotes/shared';

const VALID_APP_ENVS = ['local', 'dev', 'prod'] as const;

function resolveAppEnv(): AppEnv {
  const raw = process.env.APP_ENV;
  if (raw === undefined) {
    // Default to 'local' only when truly unset. Make it explicit and noisy.
    console.warn(
      "[env] APP_ENV is not set; defaulting to 'local'. Set APP_ENV=local|dev|prod explicitly for non-dev environments."
    );
    return 'local';
  }
  if (!(VALID_APP_ENVS as readonly string[]).includes(raw)) {
    throw new Error(
      `[env] Invalid APP_ENV='${raw}'. Must be one of: ${VALID_APP_ENVS.join(', ')}`
    );
  }
  return raw as AppEnv;
}

const APP_ENV = resolveAppEnv();
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

const derived = ENV_CONFIG[APP_ENV];
const serverDerived = SERVER_CONFIG[APP_ENV];

export const config = {
  appEnv: APP_ENV,
  isProduction: APP_ENV === 'prod',
  port: parseInt(process.env.PORT || '3001', 10),
  domain: derived.domain,
  baseUrl: derived.baseUrl,
  apiUrl: derived.apiUrl,
  databasePath: process.env.DATABASE_PATH || serverDerived.databasePath,
  secureCookies: serverDerived.secureCookies,
  contentDir:
    process.env.CONTENT_DIR || path.resolve(SERVER_DIR, '../client/src/app')
};

// Invariant: production must always emit Secure cookies. Refuse to start
// the process in an inconsistent state (e.g., production deploy with
// APP_ENV accidentally set to 'local').
if (config.isProduction && !config.secureCookies) {
  throw new Error(
    '[env] Inconsistent configuration: isProduction=true but secureCookies=false. Refusing to start.'
  );
}

export const secrets = {
  sessionSecret: requireEnv('SESSION_SECRET')
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (APP_ENV === 'local') {
      console.warn(
        `Warning: Missing ${name} — using placeholder for local dev`
      );
      return 'local-dev-placeholder';
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
