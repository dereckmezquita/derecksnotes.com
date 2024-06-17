import React from 'react';
import path from 'path';

import {
    APPLICATION_DEFAULT_METADATA,
    APPLICATION_DESCRIPTION,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { Metadata } from 'next';

import {
    PostMetadata,
    fetchPostsMetadata
} from '@components/utils/mdx/fetchPostsMetadata';
import { Index } from '@components/components/pages/index/Index';

export const metadata: Metadata = {
    title: 'DN | Blog',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts: PostMetadata[] = fetchPostsMetadata(
        path.join(ROOT_DIR_APP, 'blog/posts')
    );
    return <Index posts={posts} meta={APPLICATION_DEFAULT_METADATA} />;
}

export default Page;
