// types
export type TYPE_BUILD_ENV = 'PROD' | 'DEV' | 'LOCAL';
export type TYPE_PORT_SERVER = '3001' | '3003'; // deployment ports dev/prod
export type TYPE_PORT_CLIENT = '3000' | '3002'; // deployment ports dev/prod
export type TYPE_DOMAIN =
    | 'derecksnotes.com'
    | 'dev.derecksnotes.com'
    | 'localhost';
export type TYPE_BASE_URL_CLIENT<
    DOMAIN extends TYPE_DOMAIN,
    PORT extends TYPE_PORT_CLIENT
> = `https://${DOMAIN}` | `http://${DOMAIN}:${PORT}`;
export type TYPE_BASE_URL_SERVER<
    DOMAIN extends TYPE_DOMAIN,
    PREFIX extends string,
    PORT extends TYPE_PORT_SERVER
> = `https://${DOMAIN}/${PREFIX}` | `http://localhost:${PORT}`;

// BUILD ENVs
export const BUILD_ENV = env<TYPE_BUILD_ENV>('BUILD_ENV');
export const API_PREFIX = '/';
export const PORT_SERVER = env<TYPE_PORT_SERVER>('PORT_SERVER');
export const PORT_CLIENT = env<TYPE_PORT_CLIENT>('PORT_CLIENT');
export const DOMAIN = env<TYPE_DOMAIN>('DOMAIN');

// if local then http
export const BASE_URL_CLIENT: TYPE_BASE_URL_CLIENT<
    TYPE_DOMAIN,
    TYPE_PORT_CLIENT
> =
    BUILD_ENV === 'LOCAL'
        ? `http://${DOMAIN}:${PORT_CLIENT}`
        : `https://${DOMAIN}`;

export const BASE_URL_SERVER: TYPE_BASE_URL_SERVER<
    TYPE_DOMAIN,
    '/',
    TYPE_PORT_SERVER
> =
    BUILD_ENV === 'LOCAL'
        ? `http://localhost:${PORT_SERVER}`
        : `https://${DOMAIN}/${API_PREFIX}`;

// secrets
export const SESSION_SECRET = env('SESSION_SECRET');

// MONGO DB
export const MONGO_URI: string =
    process.env.MONGO_URI || 'linode_dereck-mongodb';
export const MONGO_PASSWORD: string = encodeURIComponent(env('MONGO_PASSWORD'));
export const MONGO_DATABASE: string = env('MONGO_DATABASE');

// REDIS
export const REDIS_URI: string = process.env.REDIS_URI || 'linode_dereck-redis';

// services
export const SENDGRID_API_KEY = env('SENDGRID_API_KEY');

// utility for getting env variables; throws if undefined
function env<T = string>(name: string, parser?: (value: string) => T): T {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Please define the ${name} environment variable`);
    }
    return parser ? parser(value) : (value as unknown as T);
}
