import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import { visit } from 'unist-util-visit';

import { DATE_YYYY_MM_DD } from '@lib/dates';
import { ROOT_DIR_APP } from '@lib/constants';

export interface PostMetadata {
    slug: string;
    title: string;
    subtitle?: string;
    blurb: string;
    summary?: string;

    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;

    // used during build
    section?: string;
    url?: string;
    path?: string;
}

export function stripMdx<T extends object>(
    filePath: string
): { summary: string; frontmatter: T } {
    try {
        if (!filePath.endsWith('.mdx')) {
            throw new Error(
                `File name must end with .mdx; received: ${filePath}`
            );
        }

        const file: string = fs.readFileSync(filePath, 'utf-8');
        const { content, data } = matter<string, any>(file);

        const parsedContent = remark()
            .use(remarkGfm)
            .use(remarkMath)
            .use(mdx)
            .use(strip)
            .parse(content);

        // extract text from paragraph nodes
        const paragraphs: string[] = [];
        visit(parsedContent, 'paragraph', (node: any) => {
            const textContent = node.children
                .map((child: any) => {
                    if (child.value) {
                        return child.value.trim();
                    }
                })
                .join('');

            if (textContent.trim() !== '') {
                paragraphs.push(textContent);
            }
        });

        // process to html and then to string
        const summary = remark()
            .processSync(paragraphs.join(' '))
            .toString()
            .trim();

        return {
            summary: summary,
            frontmatter: data as T
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filePath}`, error);
        process.exit(1);
    }
}

export function extractSinglePostMetadata(filePath: string): PostMetadata {
    try {
        const { summary, frontmatter } = stripMdx<PostMetadata>(filePath);
        const date: string = DATE_YYYY_MM_DD(frontmatter.date);

        // strip the abs path so it's the root of the website
        // i.e. client/src/app/
        const fileRoot: string = filePath
            .split('app/')[1]
            .replace('/posts/', '/')
            .replace('.mdx', '');

        return {
            slug: path.basename(filePath, '.mdx'), // removes ext
            title: frontmatter.title,
            subtitle: frontmatter.subtitle,
            blurb: frontmatter.blurb,
            summary: summary.substring(0, 300) + '...',
            coverImage: `/site-images/card-covers/${frontmatter.coverImage}.png`,
            author: frontmatter.author,
            date: date,
            tags: frontmatter.tags,
            published: frontmatter.published,
            comments: frontmatter.comments,
            path: fileRoot
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filePath}`, error);
        console.error(error);
        process.exit(1);
    }
}

export function fetchPostsMetadata(folder: string): PostMetadata[] {
    const items: string[] = fs.readdirSync(folder);
    const mdx: string[] = items.filter((item) => item.endsWith('.mdx'));
    // check if directory
    const seriesDirs = items.filter((item) =>
        fs.statSync(path.join(folder, item)).isDirectory()
    );

    // check each folder and push the first item from each into mdx
    seriesDirs.forEach((seriesDir) => {
        if (['drafts', 'deprecated', 'ignore'].includes(seriesDir)) {
            return;
        }
        const seriesItems: string[] = fs.readdirSync(
            path.join(folder, seriesDir)
        );
        const mdxFiles: string[] = seriesItems.filter((item) =>
            item.endsWith('.mdx')
        );

        // if no mdx files found inside then skip
        if (mdxFiles.length === 0) {
            return;
        }

        // sort by filename
        mdxFiles.sort();
        mdx.push(path.join(seriesDir, mdxFiles[0]));
    });

    let posts: PostMetadata[] = mdx.map((file) => {
        return extractSinglePostMetadata(path.join(folder, file));
    });

    posts = posts.filter((post) => post.published);

    return posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getPostsWithSection(section: string): PostMetadata[] {
    const posts: PostMetadata[] = fetchPostsMetadata(
        path.join(ROOT_DIR_APP, section, 'posts')
    );

    return posts.map((post) => ({
        ...post,
        section
    }));
}
