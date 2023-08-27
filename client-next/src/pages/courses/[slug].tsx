import { withPostPage } from '@components/withPostPage';
import { get_post_content, get_post_metadata, process_markdown } from '@utils/markdown';
import { GetStaticPaths, GetStaticProps } from 'next';

const section: string = 'courses';

const PostPage = withPostPage(section);

// since getStaticProps and getStaticPaths use fs; we can't modularise them outside of pages/
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postContent = get_post_content(section, params!.slug as string);
    const content = await process_markdown(postContent.content);

    // get info for side bar
    let postsMetadata = get_post_metadata(section);
    postsMetadata = postsMetadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
        props: {
            content,
            post: {
                ...postContent.data,
                date: postContent.data.date.toString()
            },
            postsMetadata
        }
    };    
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = get_post_metadata(section);
    const paths = posts.map(post => ({
        params: { slug: post.slug }
    }));

    return {
        paths,
        fallback: false
    };
};

export default PostPage;