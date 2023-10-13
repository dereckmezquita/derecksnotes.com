const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const rewrite = async () => {
    console.log('Detected we are in development mode, proxying API calls to localhost:3001');
    return [
        {
            source: '/api/v3/:path*',
            destination: 'http://localhost:3001/api/v3/:path*'
        }
    ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    staticPageGenerationTimeout: 300,
    compiler: {
        // https://stackoverflow.com/questions/67352231/why-all-styles-of-materialui-will-disappear-after-refresh-in-nextjs
        // https://nextjs.org/docs/advanced-features/compiler
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: true,
    },
    reactStrictMode: true,
}

if (process.env.NODE_ENV === 'development') {
    nextConfig.rewrites = rewrite;
}

module.exports = nextConfig
