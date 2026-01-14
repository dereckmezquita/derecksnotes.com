type BuildEnv = 'local' | 'dev' | 'prod';

const BUILD_ENV = (process.env.BUILD_ENV as BuildEnv) || 'local';

const ENV_CONFIG = {
    local: {
        domain: 'localhost',
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api',
        databasePath: './data/database.sqlite',
        secureCookies: false
    },
    dev: {
        domain: 'dev.derecksnotes.com',
        baseUrl: 'https://dev.derecksnotes.com',
        apiUrl: 'https://dev.derecksnotes.com/api',
        databasePath: '/app/data/database.sqlite',
        secureCookies: true
    },
    prod: {
        domain: 'derecksnotes.com',
        baseUrl: 'https://derecksnotes.com',
        apiUrl: 'https://derecksnotes.com/api',
        databasePath: '/app/data/database.sqlite',
        secureCookies: true
    }
} as const;

const derived = ENV_CONFIG[BUILD_ENV];

export const config = {
    buildEnv: BUILD_ENV,
    port: parseInt(process.env.PORT || '3001', 10),
    domain: process.env.DOMAIN || derived.domain,
    baseUrl: process.env.BASE_URL || derived.baseUrl,
    apiUrl: process.env.API_URL || derived.apiUrl,
    databasePath: process.env.DATABASE_PATH || derived.databasePath,
    secureCookies: derived.secureCookies,
    // Admin username - this user will automatically be added to admin group on login
    adminUsername: process.env.ADMIN_USERNAME || null
};

export const secrets = {
    sessionSecret: requireEnv('SESSION_SECRET')
    // Email service can be added later (SMTP2GO, Brevo, etc.)
};

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        if (BUILD_ENV === 'local') {
            console.warn(
                `Warning: Missing ${name} - using placeholder for local dev`
            );
            return 'local-dev-placeholder';
        }
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
