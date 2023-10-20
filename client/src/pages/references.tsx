import { GetStaticProps } from 'next';
import fetchPostMetadata from '@utils/fetchPostMetadata';
import IndexPage from '@components/pages/index-page/IndexPage';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            posts: fetchPostMetadata('references')
        }
    };
};

import { APPLICATION_METADATA } from '@constants/config';

const Index = ({ posts }: { posts: PostMetadata[] }) => {
    APPLICATION_METADATA.title = "DN | References";

    return <IndexPage posts={posts} meta={APPLICATION_METADATA} />;
};

export default Index;