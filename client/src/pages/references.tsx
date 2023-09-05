// src/pages/index.tsx
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import PostPreview from '@components/PostPreview';
import { get_post_metadata } from '@utils/markdown';

const Container = styled.div`
    width: 70%;
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;

`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

function Home({ posts }: { posts: PostMetadata[] }) {
    return (
        <Container>
            <Grid>
                {posts.map(post => (
                    <PostPreview key={post.slug} {...post} />
                ))}
            </Grid>
        </Container>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let posts: PostMetadata[] = get_post_metadata("references");
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // filter out any posts with published false
    posts = posts.filter(post => post.published);

    return {
        props: {
            posts
        }
    };
};

export default Home;