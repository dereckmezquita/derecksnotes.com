import pkg from '../../../package.json';

export const APP_VERSION = pkg.version;

const env = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Please define the ${name} environment variable`);
    }

    return value;
};
