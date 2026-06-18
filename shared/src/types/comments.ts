import type { UserBasic } from './user';

// ============================================================================
// PUBLIC COMMENT TREE
// ============================================================================

export interface CommentData {
  id: string;
  content: string;
  depth: number;
  approved: boolean;
  createdAt: string;
  editedAt: string | null;
  isDeleted: boolean;
  user: UserBasic | null;
  reactions: {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
  };
  replies: CommentData[];
  replyCount: number;
  hasMoreReplies: boolean;
}

export interface CommentsListResponse {
  comments: CommentData[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface RepliesResponse {
  replies: CommentData[];
  total: number;
  hasMore: boolean;
}

export interface CommentHistoryEntry {
  id: string;
  content: string;
  editedAt: string;
  editedBy: UserBasic;
}

// ============================================================================
// AUTHOR-SCOPED COMMENT (for /account My Comments tab)
// ============================================================================

export interface UserComment {
  id: string;
  content: string;
  slug: string;
  postTitle: string;
  depth: number;
  approved: boolean;
  createdAt: string;
  editedAt: string | null;
  isDeleted: boolean;
  likes: number;
  dislikes: number;
}
