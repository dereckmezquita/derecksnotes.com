'use client';
import { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ContentCardMetadata } from '@/utils/mdx/contentTypes';
import Card from './Card';
import { useBlogFilter } from './BlogFilterContext';
import { TagFilter } from '@/components/ui/TagFilter';
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

const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
    font-family: ${(p) => p.theme.text.font.roboto};
    font-size: 0.9rem;
    background: ${(p) => p.theme.container.background.colour.card()};
    margin-bottom: 1rem;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${(p) => p.theme.text.colour.header()};
    }

    &::placeholder {
        color: ${(p) => p.theme.text.colour.light_grey()};
    }
`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

const NoResults = styled.p`
    text-align: center;
    color: ${(p) => p.theme.text.colour.light_grey()};
    font-style: italic;
    grid-column: 1 / -1;
    padding: 2rem 0;
`;

interface IndexProps {
    posts: ContentCardMetadata[];
}

function IndexContent({ posts }: { posts: ContentCardMetadata[] }) {
    const pathname = usePathname();
    const {
        filteredPosts,
        allTags,
        selectedTags,
        setSelectedTags,
        searchQuery,
        setSearchQuery,
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
                <>
                    <SearchInput
                        type="text"
                        placeholder="Search posts by title, topic, or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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
                </>
            )}
            <Grid>
                {filteredPosts.length === 0 ? (
                    <NoResults>No posts match your search.</NoResults>
                ) : (
                    filteredPosts.map((post) => (
                        <Card
                            key={post.slug}
                            post={post}
                            section={post.section!}
                        />
                    ))
                )}
            </Grid>
        </Container>
    );
}

export function Index({ posts }: IndexProps) {
    return <IndexContent posts={posts} />;
}
