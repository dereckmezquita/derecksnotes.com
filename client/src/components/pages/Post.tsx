'use client';
import MetadataTags from '@components/components/atomic/MetadataTags';
import SideBar from '@components/components/pages/SideBar';
import {
    Article,
    PostContainer,
    PostContentWrapper,
    SideBarSiteName
} from '@components/components/pages/posts-dictionaries';
import { PageMetadata } from '@components/lib/constants';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';
import { useState, useEffect } from 'react';

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata;
    pageMetadata: PageMetadata;
    sideBarPosts: PostMetadata[];
}

// https://nextjs.org/docs/messages/react-hydration-error
// NOTE: to avoid hydration errors need to useState
// cannot do this directly from page.tsx because that exports generateStaticParams and a use client declaration is not allowed
export function Post({ source, frontmatter, pageMetadata, sideBarPosts }: DisplayPostProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    console.log(sideBarPosts);

    return (
        <>
            <MetadataTags {...pageMetadata} />
            <PostContainer>
                <SideBar posts={sideBarPosts} />
                <Article>
                    <h1>{frontmatter.title}</h1>
                    {isClient && (
                        <PostContentWrapper>{source}</PostContentWrapper>
                    )}
                </Article>
            </PostContainer>
        </>
    );
}
