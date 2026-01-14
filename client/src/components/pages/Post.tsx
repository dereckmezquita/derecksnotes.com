'use client';

import SideBar from '@components/pages/SideBar';
import {
    Article,
    PostContainer,
    PostContentWrapper
} from '@components/pages/posts-dictionaries';
import { DefinitionMetadata } from '@utils/dictionaries/fetchDefinitionMetadata';
import { PostMetadata } from '@utils/mdx/fetchPostsMetadata';
import { useState, useEffect } from 'react';
import { Comments } from '@components/comments/Comments';
import { PostReactionButtons } from '@components/posts/PostReactionButtons';
import { usePageView } from '@hooks/usePageView';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

const PostEngagement = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: ${(props) => props.theme.container.spacing.large};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
    padding-top: ${(props) => props.theme.container.spacing.medium};
    border-top: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata | DefinitionMetadata;
    sideBarPosts: PostMetadata[] | DefinitionMetadata[];
}

// We avoid hydration errors by using useState to ensure code only runs client-side.
export function Post({ source, frontmatter, sideBarPosts }: DisplayPostProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname(); // Dynamically get the current page path

    // Get the normalized slug (without leading slash)
    const slug = pathname.startsWith('/') ? pathname.substring(1) : pathname;

    // Get the title from frontmatter
    const postTitle =
        'title' in frontmatter ? frontmatter.title : frontmatter.word;

    // Track page view
    usePageView({
        slug,
        title: postTitle,
        enabled: isClient
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <PostContainer>
            <SideBar posts={sideBarPosts} />
            <Article>
                <h1>{postTitle}</h1>
                {isClient && <PostContentWrapper>{source}</PostContentWrapper>}

                {isClient && (
                    <PostEngagement>
                        <PostReactionButtons slug={slug} title={postTitle} />
                    </PostEngagement>
                )}

                {'comments' in frontmatter && frontmatter.comments && (
                    <Comments slug={slug} title={postTitle} />
                )}
            </Article>
        </PostContainer>
    );
}
