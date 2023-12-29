export { };

declare global {
    interface ArticleDTO {
        slug: string; // client should send filename of the article
        judgement?: Map<string, 'like' | 'dislike'>; // not sent; save bandwidth

        // Virtuals; optional because they are not always present
        likesCount?: number;
        dislikesCount?: number;
        totalJudgement?: number;

        // calculated by end point
        likedByCurrentUser?: boolean;
    }

    interface ArticlesMapDTO {
        [key: string]: ArticleDTO;
    }
}