const env = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Please define the ${name} environment variable`);
    }

    return value;
};

// BUILD ENVs
export const BUILD_ENV = env('BUILD_ENV');
export const BUILD_ENV_BOOL = BUILD_ENV === 'PROD' ? true : false;
export const API_URL = env('API_URL');
export const EXPRESS_PORT: string = process.env.EXPRESS_PORT || '3000';
export const SESSION_SECRET = env('SESSION_SECRET');

// MONGO DB
// if not defined locally then in linode so use docker network
export const MONGO_URI: string =
    process.env.MONGO_URI || 'linode_dereck-mongodb';
export const MONGO_PASSWORD: string = encodeURIComponent(env('MONGO_PASSWORD'));
export const MONGO_DATABASE: string = env('MONGO_DATABASE');

// REDIS
export const REDIS_URI: string = process.env.REDIS_URI || 'linode_dereck-redis';

// services
export const SENDGRID_API_KEY = env('SENDGRID_API_KEY');
