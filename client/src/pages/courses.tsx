import { GetStaticProps } from 'next';
import fetchPostMetadata from '@utils/fetchPostMetadata';
import IndexPage from '@components/ui/IndexPage';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            posts: fetchPostMetadata('courses')
        }
    };
};

const Blog = ({ posts }: { posts: PostMetadata[] }) => {
    return <IndexPage posts={posts} />;
};

export default Blog;