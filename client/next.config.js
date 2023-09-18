const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        if (process.env.NODE_ENV === 'development') {
            console.log('Detected we are in development mode, proxying API calls to localhost:3001');
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:3001/api/:path*'
                }
            ]
        }
    },
    compiler: {
        // https://stackoverflow.com/questions/67352231/why-all-styles-of-materialui-will-disappear-after-refresh-in-nextjs
        // https://nextjs.org/docs/advanced-features/compiler
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: true,
    },
}

module.exports = nextConfig
