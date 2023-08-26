import { GetStaticProps } from 'next';

import PostPreview from '@components/PostPreview';
import { get_post_metadata } from '@utils/markdown';

function Home({ posts }: { posts: PostMetadata[] }) {
    return (
        <div>
            {posts.map(post => (
                <PostPreview key={post.slug} {...post} />
            ))}
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = get_post_metadata("courses");
    return {
        props: {
            posts
        }
    };
};

export default Home;
