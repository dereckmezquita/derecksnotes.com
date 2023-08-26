import { GetStaticPaths, GetStaticProps } from 'next';
import { get_post_content, get_post_metadata, process_markdown } from '@utils/markdown';

function PostPage({ content, post }: { content: string; post: PostMetadata }) {
    return (
        <article>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postContent = get_post_content("blog", params!.slug as string);
    const content = await process_markdown(postContent.content);

    return {
        props: {
            content,
            post: {
                ...postContent.data,
                date: postContent.data.date.toString()
            }
        }
    };    
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = get_post_metadata("blog");
    const paths = posts.map(post => ({
        params: { slug: post.slug }
    }));

    return {
        paths,
        fallback: false
    };
};

export default PostPage;
