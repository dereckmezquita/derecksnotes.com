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
import { Comments } from '../ui/Comments';

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata | DefinitionMetadata;
    sideBarPosts: PostMetadata[] | DefinitionMetadata[];
}

// https://nextjs.org/docs/messages/react-hydration-error
// NOTE: to avoid hydration errors need to useState
// cannot do this directly from page.tsx because that exports generateStaticParams and a use client declaration is not allowed
export function Post({ source, frontmatter, sideBarPosts }: DisplayPostProps) {
    const [isClient, setIsClient] = useState(false);

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
                    <Comments
                        postSlug={'slug' in frontmatter ? frontmatter.slug : ''}
                    />
                )}
            </Article>
        </PostContainer>
    );
}
