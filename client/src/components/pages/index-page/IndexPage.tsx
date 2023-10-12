import { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import CardPreview from '@components/pages/index-page/CardPreview';
import TagFilter from '@components/ui/TagFilter';

import { theme } from '@styles/theme';

const Container = styled.div`
    width: 70%;
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;
    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 95%;
    }
`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

const IndexPage = ({ posts }: { posts: PostMetadata[] }) => {
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const filteredPosts = selectedTags.length > 0 ? posts.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : posts;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

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
};

export default IndexPage;