import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true
    },
    output: 'standalone',
    async rewrites() {
        // Only proxy API calls in local development
        // In dev/prod, nginx handles routing
        if (process.env.BUILD_ENV === 'local' || !process.env.BUILD_ENV) {
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:3001/api/:path*'
                }
            ];
        }
        return [];
    }
};

export default nextConfig;
