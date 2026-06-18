import type { SocialLink } from './user';

/**
 * Shape sent to PATCH /api/v1/users/me. All fields optional — server only
 * touches the ones present in the payload.
 */
export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  avatarUrl?: string | null;
  location?: string | null;
  socialLinks?: SocialLink[] | null;
}

export interface AuthError {
  error: string;
  details?: Array<{ message: string; path?: string[] }>;
}
