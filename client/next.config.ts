import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log(`Proxying API requests to ${API_URL}`);

const nextConfig: NextConfig = {
    // output: 'export',
    // images: {
    //     unoptimized: true,
    // },
    // output: 'standalone',
    // assetPrefix: process.env.NEXT_PUBLIC_APP_URL || '', // if standalone
    // ---
    // only used with dynamic rendering, not compatible with output: 'export' | 'standalone'
    // used locally for rewriting api calls to X server
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/:path*`
            }
        ];
    },
    compiler: {
        styledComponents: true
    }
};

export default nextConfig;
