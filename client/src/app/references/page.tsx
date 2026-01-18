import React from 'react';

import { APPLICATION_DESCRIPTION } from '@lib/constants';
import { Metadata } from 'next';

import { getSectionContent } from '@utils/mdx/fetchContentMetadata';
import { Index } from '@components/pages/index/Index';

export const metadata: Metadata = {
    title: 'Dn | References',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts = getSectionContent('references');

    return <Index posts={posts} />;
}

export default Page;
