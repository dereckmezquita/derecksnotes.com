export {};

declare global {
    interface ArticleMetadata {
        slug: string; // client should send filename of the article
        judgement: Map<string, 'like' | 'dislike'>;
    }
}
