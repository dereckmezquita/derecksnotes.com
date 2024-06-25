const SESSION_MAX_AGE_DAYS: number = 30;
export const SESSION_MAX_AGE: number =
    SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date()
        .toISOString()
        .replace('T', '-')
        .slice(0, 19)
        .replace(/:/g, '');
}

export const MAX_COMMENT_DEPTH: number = 5;

export const SINGLE_HOUR: number = 60 * 60 * 1000;

const hours: number = 3;
export const TOKEN_VALIDITY_HOURS: number = 60 * 60 * 1000 * hours;
export const TOKEN_SIZE: number = 64;
