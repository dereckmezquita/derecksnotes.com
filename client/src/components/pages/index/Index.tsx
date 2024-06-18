'use client';
import styled from 'styled-components';
import { useState } from 'react';

import { theme } from '@components/styles/theme';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';

import MetadataTags from '@components/components/atomic/MetadataTags';
import Card from './Card';

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
    meta: {
        title: string;
        description: string;
        image: string;
        url: string;
    };
}

export function Index({ posts, meta }: IndexProps) {
    const allTags: string[] = Array.from(
        new Set(posts.flatMap((post) => post.tags))
    ).sort();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    let filteredPosts = posts;
    if (selectedTags.length > 0) {
        filteredPosts = posts.filter((post) =>
            selectedTags.every((tag) => post.tags.includes(tag))
        );
    }

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) => [...prev, tag]);
    };

    const handleDeselectTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    return (
        <>
            <MetadataTags {...meta} />
            <Container>
                <Grid>
                    {filteredPosts.map((post) => (
                        <Card key={post.slug} post={post} section={post.section!} />
                    ))}
                </Grid>
            </Container>
        </>
    );
}
