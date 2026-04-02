/**
 * Represents a user in the system.
 * Matches the server's user response format from /api/v1/auth/me.
 */
export interface User {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
    groups: string[];
    permissions: string[];
}

/**
 * Authentication error response from the server.
 */
export interface AuthError {
    error: string;
    details?: Array<{ message: string; path?: string[] }>;
}
