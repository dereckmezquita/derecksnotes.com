/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://derecksnotes.com/api/:path*'
            },
        ]
    },
    compiler: {
        // https://stackoverflow.com/questions/67352231/why-all-styles-of-materialui-will-disappear-after-refresh-in-nextjs
        // https://nextjs.org/docs/advanced-features/compiler
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: true,
    },
}

module.exports = nextConfig
