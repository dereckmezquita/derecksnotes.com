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
import { Comments } from '@components/ui/CommentsSection/Comments';
import { usePathname } from 'next/navigation';

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata | DefinitionMetadata;
    sideBarPosts: PostMetadata[] | DefinitionMetadata[];
}

// We avoid hydration errors by using useState to ensure code only runs client-side.
export function Post({ source, frontmatter, sideBarPosts }: DisplayPostProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname(); // Dynamically get the current page path

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <PostContainer>
            <SideBar posts={sideBarPosts} />
            <Article>
                <h1>
                    {'title' in frontmatter
                        ? frontmatter.title
                        : frontmatter.word}
                </h1>
                {isClient && <PostContentWrapper>{source}</PostContentWrapper>}
                {'comments' in frontmatter && frontmatter.comments && (
                    // Pass the current pathname as postSlug, removing leading slash
                    <Comments
                        postSlug={
                            pathname.startsWith('/')
                                ? pathname.substring(1)
                                : pathname
                        }
                    />
                )}
            </Article>
        </PostContainer>
    );
}
