import { GetStaticProps } from 'next';
import fetchPostMetadata from '@utils/fetchPostMetadata';
import IndexPage from '@components/pages/index-page/IndexPage';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            posts: fetchPostMetadata('blog')
        }
    };
};

const Index = ({ posts }: { posts: PostMetadata[] }) => {
    return <IndexPage posts={posts} />;
};

export default Index;