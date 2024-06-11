import { GetStaticPaths, GetStaticProps } from 'next';
import PostPage from '@components/pages/post-page/PostPage';

const section = 'blog';

// ----------------------------------------
const Post = (props: any) => {
    return <PostPage {...props} section={section} />;
};

// ----------------------------------------
import {
    getMDXSource,
    getSidebarData
} from '@components/pages/post-page/postHelpers';
import { get_single_post_metadata } from '@utils/markdown/get_post_metadata';

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const side_bar_data = getSidebarData(section);
    const mdxSource = await getMDXSource(section, params!.slug as string);
    let summary: string =
        get_single_post_metadata(section, (params!.slug as string) + '.mdx')
            .summary || '';

    // only let 200 characters through
    summary = summary.slice(0, 300) + '...';

    // if not published, return 404
    if (!mdxSource.frontmatter.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            frontmatter: mdxSource.frontmatter,
            summary,
            source: mdxSource.source,
            side_bar_data: side_bar_data
        }
    };
};

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
};

export default Post;
