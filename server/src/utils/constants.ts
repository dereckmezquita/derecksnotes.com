// Authentication constants
const SESSION_MAX_AGE_DAYS: number = 30;
export const SESSION_MAX_AGE: number =
    SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
export const REMEMBER_ME_MAX_AGE: number = 90 * 24 * 60 * 60 * 1000; // 90 days

// Time constants
export const SINGLE_HOUR: number = 60 * 60 * 1000;
export const SINGLE_DAY: number = 24 * SINGLE_HOUR;

// Token constants
export const TOKEN_SIZE: number = 64;
export const MAGIC_LINK_VALIDITY_HOURS: number = 3;
export const TOKEN_VALIDITY_HOURS: number =
    SINGLE_HOUR * MAGIC_LINK_VALIDITY_HOURS;
export const PASSWORD_RESET_VALIDITY_HOURS: number = 1; // 1 hour
export const EMAIL_VERIFICATION_VALIDITY_DAYS: number = 7; // 7 days

// Rate limiting
export const MAX_LOGIN_ATTEMPTS: number = 5;
export const LOGIN_ATTEMPTS_WINDOW_MINUTES: number = 15;
export const PASSWORD_RESET_RATE_LIMIT: number = 3; // Per day

// Comments
export const MAX_COMMENT_DEPTH: number = 5;
export const MAX_COMMENT_LENGTH: number = 5000;

// Formatting helpers
export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date()
        .toISOString()
        .replace('T', '-')
        .slice(0, 19)
        .replace(/:/g, '');
}
