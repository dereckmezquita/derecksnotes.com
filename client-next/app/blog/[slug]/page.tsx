import {
    get_post_metadata, get_post_content, process_markdown
} from '@utils/markdown';

// a next function to generate static paths for the dynamic pages
export const generateStaticParams = (): Array<{ slug: string }> => {
    const posts = get_post_metadata('blog');
    return posts.map((post: PostMetadata) => {
        return { slug: post.slug }
    });
}

// nextjs 13 can await in components no longer need to use getStaticProps
const PostPage = async (props: any): Promise<JSX.Element> => {
    const slug = props.params.slug;
    const post = get_post_content('blog', slug);
    const content = await process_markdown(post.content);

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default PostPage;