import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derecksnotes.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Allow legitimate search engines
            {
                userAgent: 'Googlebot',
                allow: '/',
                crawlDelay: 1
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                crawlDelay: 1
            },
            {
                userAgent: 'DuckDuckBot',
                allow: '/',
                crawlDelay: 1
            },
            {
                userAgent: 'Slurp',
                allow: '/',
                crawlDelay: 2
            },
            {
                userAgent: 'YandexBot',
                allow: '/',
                crawlDelay: 2
            },
            // SEO tools - allow but with delay
            {
                userAgent: 'SemrushBot',
                allow: '/',
                crawlDelay: 5
            },
            {
                userAgent: 'AhrefsBot',
                disallow: '/site-images/',
                crawlDelay: 10
            },
            // Block known aggressive scrapers and AI training bots
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'CCBot',
                    'anthropic-ai',
                    'Claude-Web',
                    'Bytespider',
                    'PetalBot',
                    'Applebot-Extended',
                    'Google-Extended',
                    'FacebookBot',
                    'Meta-ExternalAgent'
                ],
                disallow: '/'
            },
            // Block common scraping tools
            {
                userAgent: [
                    'python-requests',
                    'python-httpx',
                    'Scrapy',
                    'curl',
                    'wget',
                    'Go-http-client',
                    'Java',
                    'libwww-perl'
                ],
                disallow: '/'
            },
            // Block known bad actors
            {
                userAgent: [
                    'MJ12bot',
                    'DotBot',
                    'BLEXBot',
                    'SeznamBot',
                    'Sogou',
                    'Baiduspider'
                ],
                disallow: '/'
            },
            // Default rule for all other bots
            {
                userAgent: '*',
                disallow: [
                    '/api/',
                    '/_next/',
                    '/site-images/card-covers/',
                    '/dictionaries/'
                ],
                crawlDelay: 2
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`
    };
}
