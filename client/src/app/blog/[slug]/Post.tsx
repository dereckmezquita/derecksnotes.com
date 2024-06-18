'use client';
import MetadataTags from '@components/components/atomic/MetadataTags';
import { PageMetadata } from '@components/lib/constants';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';
import { useState, useEffect } from 'react';

interface DisplayPostProps {
    source: React.ReactNode;
    frontmatter: PostMetadata;
    pageMetadata: PageMetadata;
}

// https://nextjs.org/docs/messages/react-hydration-error
// NOTE: to avoid hydration errors need to useState
// cannot do this directly from page.tsx because that exports generateStaticParams and a use client declaration is not allowed
export function Post({ source, frontmatter, pageMetadata }: DisplayPostProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <>
                    <MetadataTags {...pageMetadata} />
                    <h1>{frontmatter.title}</h1>
                    {source}
                </>
            )}
        </>
    );
}
