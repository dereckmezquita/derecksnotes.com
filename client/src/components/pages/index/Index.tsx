'use client';
import { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@components/styles/theme';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';
import Card from './Card';
import { useBlogFilter } from './BlogFilterContext';
import { TagFilter } from '@components/components/ui/TagFilter';
import { usePathname } from 'next/navigation';

/**
 * Container for index page; no styling just holds things together.
 */
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

interface IndexProps {
    posts: PostMetadata[];
}

function IndexContent({ posts }: { posts: PostMetadata[] }) {
    const pathname = usePathname();
    const {
        filteredPosts,
        allTags,
        selectedTags,
        setSelectedTags,
        isFilterVisible,
        setPosts,
        resetFilter
    } = useBlogFilter();

    useEffect(() => {
        setPosts(posts);
    }, [posts, setPosts]);

    useEffect(() => {
        // Reset filter when the pathname changes
        resetFilter();
    }, [pathname, resetFilter]);

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) => [...prev, tag]);
    };

    const handleDeselectTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    return (
        <Container>
            {isFilterVisible && (
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleDeselectTag}
                    styleContainer={{
                        backgroundColor: 'inherit',
                        boxShadow: 'none',
                        border: 'none',
                        marginBottom: '20px'
                    }}
                />
            )}
            <Grid>
                {filteredPosts.map((post) => (
                    <Card key={post.slug} post={post} section={post.section!} />
                ))}
            </Grid>
        </Container>
    );
}

export function Index({ posts }: IndexProps) {
    return <IndexContent posts={posts} />;
}
