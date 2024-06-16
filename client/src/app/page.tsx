import React from 'react';

import { APP_VERSION } from '@components/lib/env';
import { API_URL } from '@components/lib/env';

export default async function Page() {
    return (
        <div>
            <h1>Next.js App</h1>
            <h2>Version: {APP_VERSION}</h2>
            <h2>API URL: {API_URL}</h2>
        </div>
    );
}
