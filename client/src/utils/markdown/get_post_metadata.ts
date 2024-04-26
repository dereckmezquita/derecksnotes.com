import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/config';

import { remark } from 'remark';
// import strip from 'strip-markdown';
import strip from 'remark-mdx-to-plain-text';
import mdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { visit } from 'unist-util-visit';

export function get_single_post_metadata(
    folder: string,
    file_name: string
): PostMetadata {
    try {
        // if file_name doesn't end with .mdx; throw error
        if (!file_name.endsWith('.mdx')) {
            throw new Error(`File name must end with .mdx: ${file_name}`);
        }
        const file: string = path.join(ROOT, 'content', folder, file_name);
        const file_contents: string = fs.readFileSync(file, 'utf8');
        const { data, content } = matter(
            file_contents
        ) as matter.GrayMatterFile<string>;

        const parsedContent = remark()
            .use(remarkGfm)
            .use(remarkMath)
            .use(mdx)
            .use(strip)
            .parse(content);

        // Extract text from paragraph nodes
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
            slug: file_name.replace('.mdx', ''),
            section: folder,

            title: data.title,
            blurb: data.blurb,
            coverImage: `/site-images/card-covers/${data.coverImage}.png`,
            author: data.author,
            date:
                typeof data.date === 'string'
                    ? data.date
                    : data.date.toISOString().split('T')[0],

            summary: summary,

            tags: data.tags,

            published: data.published,
            subtitle: data.subtitle ? data.subtitle : ''
        };
    } catch (error: any) {
        console.error(`Error processing file: ${file_name}`);
        console.error(error);
        process.exit(1);
    }
}

// NOTE: func used in getStaticProps
// props are passed to IndexPage as PostMetadata[]
//    IndexPage uses: tags, slug
// props are passed to CardPreview as PostMetadata
//    CardPreview uses: slug, blurb, title, coverImage, author, date

export default function get_post_metadata(folder: string): PostMetadata[] {
    const files = fs.readdirSync(path.join(ROOT, 'content', folder));
    const md = files.filter((fn) => fn.endsWith('.mdx'));

    return md.map((file_name) => {
        return get_single_post_metadata(folder, file_name);
    });
}
