export interface SocialLink {
  label: string;
  url: string;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  socialLinks: SocialLink[];
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
