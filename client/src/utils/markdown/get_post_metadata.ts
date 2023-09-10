import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';

import { remark } from 'remark';
import strip from 'strip-markdown';
import { visit } from 'unist-util-visit';

export default function get_post_metadata(folder: string): PostMetadata[] {
    const files = fs.readdirSync(path.join(ROOT, 'content', folder));
    const md = files.filter((fn) => fn.endsWith('.md'));
    // get gray-matter metadata
    return md.map((file_name) => {
        const file: string = path.join(ROOT, 'content', folder, file_name);
        const file_contents: string = fs.readFileSync(file, 'utf8');
        const { data, content } = matter(file_contents) as matter.GrayMatterFile<string>;

        const parsedContent = remark().use(strip).parse(content);

        // Extract text from paragraph nodes
        const paragraphs: string[] = [];
        visit(parsedContent, 'paragraph', (node: any) => {
            const textContent = node.children
                .filter((child: any) => {
                    // if value starts with a pipe, it's a table
                    if (/\|/.test(child.value)) return false;

                    // search for [!NOTE], [!IMPORTANT], [!WARNING]
                    if (/\[!\w+\]/.test(child.value)) return false;

                    return true;
                })
                // .filter((child: any) => child.type === 'paragraph')
                .map((child: any) => {
                    // if child.value
                    if (child.value) {
                        return child.value
                            .replace(/\[\^\d+\]:?/g, '') // footnotes [^1]
                            .replace(/^\[( |x)\]/g, '') // task lists * [ ]
                            .replace(/~{1,2}/g, '') // strikethrough ~ 1 or 2 ~~
                            .trim();
                    }
                })
                // .map((child: any) => child.value)
                .join('');

            if (textContent.trim() !== '') {
                paragraphs.push(textContent);
            }
        });

        // process to html and then to string like the process_post_mdx function so we can then display it
        const summary = remark()
            .processSync(paragraphs.join(' '))
            .toString()
            .trim();

        return {
            slug: file_name.replace('.md', ''),
            section: folder,

            title: data.title,
            blurb: data.blurb,
            coverImage: `/site-images/card-covers/${data.coverImage}.png`,
            author: data.author,
            // to date format YYYT-MM-DD HH:MM:SS
            date: typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0],

            summary: summary,

            tags: data.tags,

            published: data.published,
            subtitle: data.subtitle ? data.subtitle : '',
        };
    });
}