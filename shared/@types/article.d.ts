export { };

declare global {
    interface ArticleMetadata {
        slug: string; // client should send filename of the article
        judgements: Map<string, 'like' | 'dislike'>;
    }
}