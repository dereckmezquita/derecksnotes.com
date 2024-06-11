const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const rewrite = async () => {
    console.log(
        'Detected we are in development mode, proxying API calls to localhost:3004'
    );
    return [
        {
            source: '/api/v3/:path*',
            destination:
                process.env.NEXT_PUBLIC_SERVER_DEV === 'true'
                    ? 'http://test.derecksnotes.com/api/:path*'
                    : 'http://localhost:3004/api/:path*'
        }
    ];
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    staticPageGenerationTimeout: 300,
    compiler: {
        // https://stackoverflow.com/questions/67352231/why-all-styles-of-materialui-will-disappear-after-refresh-in-nextjs
        // https://nextjs.org/docs/advanced-features/compiler
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: true
    },
    reactStrictMode: false
};

if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    nextConfig.rewrites = rewrite;
} else {
    nextConfig.output = 'export';
}

module.exports = nextConfig;
