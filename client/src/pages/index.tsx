// src/pages/index.tsx
import { useState } from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import PostPreview from '@components/PostPreview';
import TagFilter from '@components/ui/TagFilter';
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
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : posts;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    return (
        <>
            <Container>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                />
                <Grid>
                    {filteredPosts.map(post => (
                        <PostPreview key={post.slug} {...post} />
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let posts: PostMetadata[] = get_post_metadata("blog");
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