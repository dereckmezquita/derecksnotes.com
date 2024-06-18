import { URL } from 'url';
import pkg from '../../../package.json';

export const APP_VERSION = pkg.version;

const env = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Please define the ${name} environment variable`);
    }
    return value;
};

export const APP_URL: string = env('NEXT_PUBLIC_APP_URL');

export const API_URL: string = new URL('/api/', APP_URL).toString();

export const BUILD_ENV: string = env('NEXT_PUBLIC_BUILD_ENV');
