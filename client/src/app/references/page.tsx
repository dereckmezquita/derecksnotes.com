import React from 'react';

import { APPLICATION_DESCRIPTION } from '@lib/constants';
import { Metadata } from 'next';

import { PostMetadata, getSectionPosts } from '@utils/mdx/fetchPostsMetadata';
import { Index } from '@components/pages/index/Index';

export const metadata: Metadata = {
    title: 'Dn | References',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts: PostMetadata[] = getSectionPosts('references');

    return <Index posts={posts} />;
}

export default Page;
