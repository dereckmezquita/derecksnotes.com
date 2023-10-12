import { GetStaticPaths, GetStaticProps } from 'next';
import PostPage from '@components/pages/post-page/PostPage';

const section = 'references';

// ----------------------------------------
const Post = (props: any) => {
    return (
        <PostPage {...props} section={section} />
    );
}

// ----------------------------------------
import { getMDXSource, getSidebarData } from '@components/pages/post-page/postHelpers';

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const side_bar_data = getSidebarData(section);
    const mdxSource = await getMDXSource(section, params!.slug as string);

    // if not published, return 404
    if (!mdxSource.frontmatter.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            title: mdxSource.frontmatter.title,
            source: mdxSource.source,
            side_bar_data: side_bar_data
        },
    };
}

// ----------------------------------------
// the goal of this function getStaticPaths is to
// return a list of all possible values for slug
// so that nextjs can pre-render all the possible
import { getAllSlugs } from '@components/pages/post-page/postHelpers';

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllSlugs(section);

    return {
        paths,
        fallback: false
    };
}

export default Post;