import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import { visit } from 'unist-util-visit';

export interface PostMetadata {
    slug: string;
    title: string;
    blurb: string;
    summary?: string;

    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
}

export function extractSinglePostMetadata(filepath: string): PostMetadata {
    try {
        if (!filepath.endsWith('.mdx')) {
            throw new Error(
                `File name must end with .mdx; received: ${filepath}`
            );
        }

        const file: string = fs.readFileSync(filepath, 'utf-8');
        const { data, content } = matter(file);

        const parsedContent = remark()
            .use(remarkGfm)
            .use(mdx)
            .use(strip)
            .parse(content);

        // extrat text from paragraph nodes
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
            slug: path.basename(filepath, '.mdx'),
            title: data.title,
            blurb: data.subtitle,
            summary: summary.substring(0, 300) + '...',
            coverImage: data.coverImage,
            author: data.author,
            date: data.date,
            tags: data.tags,
            published: data.published
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filepath}`, error);
        console.error(error);
        process.exit(1);
    }
}

export function fetchPostsMetadata(folder: string): PostMetadata[] {
    const files: string[] = fs.readdirSync(folder);
    const mdx: string[] = files.filter((file) => file.endsWith('.mdx'));

    let posts: PostMetadata[] = mdx.map((file) => {
        return extractSinglePostMetadata(path.join(folder, file));
    });

    posts = posts.filter((post) => post.published);

    return posts;
}
