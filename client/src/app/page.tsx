import React from 'react';
import path from 'path';

import { API_URL, APP_VERSION } from '@components/lib/env';
import {
    APPLICATION_DESCRIPTION,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { Metadata } from 'next';

import {
    PostMetadata,
    fetchPostsMetadata
} from '@components/utils/mdx/fetchPostsMetadata';

export const metadata: Metadata = {
    title: 'DN | Blog',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const posts: PostMetadata[] = fetchPostsMetadata(
        path.join(ROOT_DIR_APP, 'posts')
    );
    return (
        <div>
            <h1>Next.js App</h1>
            <h2>Version: {APP_VERSION}</h2>
            <h2>API URL: {API_URL}</h2>
        </div>
    );
}

export default Page;
