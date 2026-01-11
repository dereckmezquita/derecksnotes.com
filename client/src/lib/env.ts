import pkg from '../../../package.json';

type BuildEnv = 'local' | 'dev' | 'prod';

const BUILD_ENV =
    (process.env.NEXT_PUBLIC_BUILD_ENV as BuildEnv) ||
    (process.env.BUILD_ENV as BuildEnv) ||
    'local';

const ENV_CONFIG = {
    local: {
        domain: 'localhost',
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api'
    },
    dev: {
        domain: 'dev.derecksnotes.com',
        baseUrl: 'https://dev.derecksnotes.com',
        apiUrl: 'https://dev.derecksnotes.com/api'
    },
    prod: {
        domain: 'derecksnotes.com',
        baseUrl: 'https://derecksnotes.com',
        apiUrl: 'https://derecksnotes.com/api'
    }
} as const;

const derived = ENV_CONFIG[BUILD_ENV];

export const config = {
    version: pkg.version,
    buildEnv: BUILD_ENV,
    isProduction: BUILD_ENV === 'prod',
    domain: process.env.NEXT_PUBLIC_DOMAIN || derived.domain,
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || derived.baseUrl,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || derived.apiUrl
};

// Legacy exports for backwards compatibility
export const NEXT_PUBLIC_BUILD_ENV = BUILD_ENV;
export const NEXT_PUBLIC_APP_VERSION = pkg.version;
export const NEXT_PUBLIC_BUILD_ENV_BOOL = BUILD_ENV !== 'prod';
