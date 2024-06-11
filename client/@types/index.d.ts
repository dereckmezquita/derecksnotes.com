export {};

declare global {
    interface PostMetadata {
        slug: string; // filename
        section: string; // folder where content is; passed by function

        title: string;
        blurb: string; // random phrase
        coverImage: string; // stored in md as a single number
        author: string;
        date: string;

        summary: string; // derived from content

        tags: string[];

        published: boolean;
        subtitle?: string;
    }
}
