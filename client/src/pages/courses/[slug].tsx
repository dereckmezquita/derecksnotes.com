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
    let posts: PostMetadata[] = get_post_metadata(section);
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // remove those not published
    posts = posts.filter(post => post.published);

    // if post is not published, return 404
    if (!postContent.data.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            content,
            post: {
                ...postContent.data,
                date: postContent.data.date.toString()
            },
            posts
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