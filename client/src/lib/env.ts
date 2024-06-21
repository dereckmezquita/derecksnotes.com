import pkg from '../../../package.json';

export const NEXT_PUBLIC_APP_VERSION = pkg.version;

export const NEXT_PUBLIC_APP_URL: string | undefined =
    process.env.NEXT_PUBLIC_APP_URL;

export const NEXT_PUBLIC_API_URL: string | undefined =
    process.env.NEXT_PUBLIC_API_URL;

export const NEXT_PUBLIC_BUILD_ENV: string | undefined =
    process.env.NEXT_PUBLIC_BUILD_ENV;
