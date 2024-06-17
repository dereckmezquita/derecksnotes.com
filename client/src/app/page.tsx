import React from 'react';

import { API_URL, APP_VERSION } from '@components/lib/env';
import { APPLICATION_DESCRIPTION } from '@components/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DN | Blog',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    return (
        <div>
            <h1>Next.js App</h1>
            <h2>Version: {APP_VERSION}</h2>
            <h2>API URL: {API_URL}</h2>
        </div>
    );
}

export default Page;
