/**
 * Password policy — single source of truth for client validation hints AND
 * the server-side zod schemas (auth.ts register, users.ts password change).
 * Keep in sync with services/auth.ts prehashForBcrypt input expectations.
 */
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requiresUpper: true,
  requiresLower: true,
  requiresDigit: true
} as const;

export function isPasswordValid(password: string): boolean {
  if (password.length < PASSWORD_RULES.minLength) return false;
  if (password.length > PASSWORD_RULES.maxLength) return false;
  if (PASSWORD_RULES.requiresUpper && !/[A-Z]/.test(password)) return false;
  if (PASSWORD_RULES.requiresLower && !/[a-z]/.test(password)) return false;
  if (PASSWORD_RULES.requiresDigit && !/[0-9]/.test(password)) return false;
  return true;
}
