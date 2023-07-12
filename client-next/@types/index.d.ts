
export { };

declare global {
    interface PostMetadata {
        slug: string;
        title: string;
        subtitle: string;
        date: string;
        coverImage?: string;
    };
}
