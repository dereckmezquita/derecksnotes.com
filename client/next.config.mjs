/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/api/:path*`
            }
        ];
    },
    output: 'export' // output static files at build
};

export default nextConfig;
