import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
    sessionId?: string;
    permissions?: Set<string>;
}

export interface UserWithGroups {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: Date;
    groups: string[];
    permissions: string[];
}
