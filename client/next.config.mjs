/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// only used with dynamic rendering, not compatible with output: 'export' | 'standalone'
// used locally for rewriting api calls to X server
async function rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: `${API_URL}/api/:path*`
        }
    ];
}

const nextConfig = {
    // output: 'export',
    // images: {
    //     unoptimized: true,
    // },
    // output: 'standalone',
    // assetPrefix: process.env.NEXT_PUBLIC_APP_URL || '', // if standalone
    compiler: {
        styledComponents: true
    }
};

export default nextConfig;
