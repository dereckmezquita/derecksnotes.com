export interface User {
  id: string;
  username: string;
  email: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  groups: string[];
  permissions: string[];
}

export interface UserBasic {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AuthError {
  error: string;
  details?: Array<{ message: string; path?: string[] }>;
}
