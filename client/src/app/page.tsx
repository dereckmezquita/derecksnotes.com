import React from 'react';

import {
    APPLICATION_DESCRIPTION
} from '@components/lib/constants';
import { Metadata } from 'next';

import {
    PostMetadata,
    getPostsWithSection
} from '@components/utils/mdx/fetchPostsMetadata';
import { Index } from '@components/components/pages/index/Index';

export const metadata: Metadata = {
    title: 'Dn | Blog',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts: PostMetadata[] = getPostsWithSection('blog');

    return <Index posts={posts} />;
}

export default Page;
