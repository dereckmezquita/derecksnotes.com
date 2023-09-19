import { useState } from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import CardPreview from '@components/ui/CardPreview';
import TagFilter from '@components/ui/TagFilter';
import get_post_metadata from '@utils/markdown/get_post_metadata';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const section: string = 'blog';

// ------------------------------------
// ------------------------------------

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
    console.log(`Welcome; there are ${posts.length} posts.`);

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

    // redux control for tag filter visibility
    const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

    return (
        <Container>
            <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                visible={tagsFilterVisible}
            />
            <Grid>
                {filteredPosts.map(post => (
                    <CardPreview key={post.slug} {...post} />
                ))}
            </Grid>
        </Container>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let posts: PostMetadata[] = get_post_metadata(section);
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