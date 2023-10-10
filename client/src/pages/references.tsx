import { GetStaticProps } from 'next';
import fetchPostMetadata from '@utils/fetchPostMetadata';
import PostPage from '@components/ui/IndexPage';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            posts: fetchPostMetadata('references')
        }
    };
};

const Blog = ({ posts }: { posts: PostMetadata[] }) => {
    return <PostPage posts={posts} />;
};

export default Blog;