'use client';
import SideBar from '@components/components/pages/SideBar';
import {
    Article,
    PostContainer,
    PostContentWrapper
} from '@components/components/pages/posts-dictionaries';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';
import { useState, useEffect } from 'react';

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata;
    sideBarPosts: PostMetadata[];
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
                <h1>{frontmatter.title}</h1>
                {isClient && <PostContentWrapper>{source}</PostContentWrapper>}
            </Article>
        </PostContainer>
    );
}
