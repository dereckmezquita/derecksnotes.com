import React from 'react';
import path from 'path';

import {
    APPLICATION_DEFAULT_METADATA,
    APPLICATION_DESCRIPTION,
} from '@components/lib/constants';
import { Metadata } from 'next';

import {
    PostMetadata,
    getPostsWithSection
} from '@components/utils/mdx/fetchPostsMetadata';
import { Index } from '@components/components/pages/index/Index';

export const metadata: Metadata = {
    title: 'DN | Blog',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts: PostMetadata[] = getPostsWithSection('courses');

    return <Index posts={posts} meta={APPLICATION_DEFAULT_METADATA} />;
}

export default Page;
