export interface PostBasic {
  slug: string;
  title: string;
}

export interface PostReactionResponse {
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}

/** Alias kept for legacy GET /posts/stats — same shape as the reaction response. */
export type PostStats = PostReactionResponse;

export interface ReadHistoryEntry {
  postSlug: string;
  postTitle: string;
  readAt: string;
}
