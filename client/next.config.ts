import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  async rewrites() {
    // Only proxy API calls in local development
    // In dev/prod, nginx handles routing
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
    if (appEnv === 'local' || !appEnv) {
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
