export { };

declare global {
    interface ArticleMetadata {
        slug: string; // client should send filename of the article
        commentedBy: string[]; // array of usernames
        judgements: {
            username: string;
            judgement: 'like' | 'dislike';
        }[];
    }
}