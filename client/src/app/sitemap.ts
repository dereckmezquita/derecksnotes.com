import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR_APP } from '@lib/constants.server';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derecksnotes.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemap: MetadataRoute.Sitemap = [];

    // Add static pages
    sitemap.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0
    });

    sitemap.push({
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    });

    sitemap.push({
        url: `${baseUrl}/references`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    });

    sitemap.push({
        url: `${baseUrl}/profile`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5
    });

    // Add blog posts
    const blogDir = path.join(ROOT_DIR_APP, 'blog', 'posts');
    if (fs.existsSync(blogDir)) {
        const blogPosts = getAllMdxFiles(blogDir);
        blogPosts.forEach((post) => {
            sitemap.push({
                url: `${baseUrl}/blog/${post}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7
            });
        });
    }

    // Add course posts
    const coursesDir = path.join(ROOT_DIR_APP, 'courses', 'posts');
    if (fs.existsSync(coursesDir)) {
        const coursePosts = getAllMdxFiles(coursesDir);
        coursePosts.forEach((post) => {
            sitemap.push({
                url: `${baseUrl}/courses/${post}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7
            });
        });
    }

    // Add reference posts
    const referencesDir = path.join(ROOT_DIR_APP, 'references', 'posts');
    if (fs.existsSync(referencesDir)) {
        const referencePosts = getAllMdxFiles(referencesDir);
        referencePosts.forEach((post) => {
            sitemap.push({
                url: `${baseUrl}/references/${post}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6
            });
        });
    }

    // Add dictionary definitions
    const dictionaries = ['mathematics', 'chemistry', 'biology'];
    dictionaries.forEach((dictionary) => {
        const dictDir = path.join(
            ROOT_DIR_APP,
            'dictionaries',
            dictionary,
            'definitions'
        );
        if (fs.existsSync(dictDir)) {
            const definitions = fs
                .readdirSync(dictDir)
                .filter((file) => file.endsWith('.mdx'))
                .map((file) => path.basename(file, '.mdx'));

            definitions.forEach((definition) => {
                sitemap.push({
                    url: `${baseUrl}/dictionaries/${dictionary}/${definition}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6
                });
            });
        }
    });

    return sitemap;
}

function getAllMdxFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);

    items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip certain directories
            if (['drafts', 'deprecated', 'ignore'].includes(item)) {
                return;
            }

            // Get MDX files from subdirectories
            const subFiles = fs
                .readdirSync(fullPath)
                .filter((file) => file.endsWith('.mdx'))
                .map((file) => `${item}/${path.basename(file, '.mdx')}`);

            files.push(...subFiles);
        } else if (item.endsWith('.mdx')) {
            files.push(path.basename(item, '.mdx'));
        }
    });

    return files;
}
