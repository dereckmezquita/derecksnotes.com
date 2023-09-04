import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';

import { remark } from 'remark';
import strip from 'strip-markdown';
import { visit } from 'unist-util-visit';

export const get_post_metadata = (folder: string): PostMetadata[] => {
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

        // process to html and then to string like the process_markdown function so we can then display it
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

// --------------------------------
// --------------------------------

export const get_post_content = (folder: string, slug: string): matter.GrayMatterFile<string> => {
    const file: string = path.join(path.join(ROOT, 'content', folder), `${slug}.md`);
    const content: string = fs.readFileSync(file, 'utf8');
    return matter(content);
}

// --------------------------------
// --------------------------------

import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype'; // processor
import rehypePrettyCode from 'rehype-pretty-code'; // prettify code blocks
import stringify from 'rehype-stringify'; // html to string; processor
import remarkGfm from 'remark-gfm'; // github flavored markdown
import rehypeRaw from "rehype-raw"; // allows html in markdown
import rehypeSlug from 'rehype-slug'; // adds id to headings
import remarkUnwrapImages from 'remark-unwrap-images'; // remove image wrapper
import remarkExternalLinks from 'remark-external-links';

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax'

import remarkTocCollapse from './remark/remarkTocCollapse';
import rehypeDropCap from './rehype/rehypeDropCap';
import rehypeAddHeadingLinks from './rehype/rehypeAddHeadingLinks';
import rehypeStyledAlerts from './rehype/rehypeStyledAlerts';

import { theme } from '@styles/theme';

export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown) // parse markdown
        .use(remarkMath)
        .use(remarkGfm) // github flavored markdown
        .use(remarkUnwrapImages) // remove image wrapper
        .use(remarkExternalLinks) // add target="_blank" to external links
        .use(remarkTocCollapse)
        .use(remark2rehype, { // markdown to html
            allowDangerousHtml: true // allows html in markdown such as br etc.
        })
        .use(rehypeMathjax)
        .use(rehypeDropCap, {
            float: 'left',
            fontSize: '4rem',
            fontFamily: 'Georgia, serif',
            lineHeight: '40px',
            marginRight: '0.1em',
            color: theme.theme_colours[5](),
        })
        .use(rehypeStyledAlerts)
        .use(rehypeRaw) // allows html in markdown
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(rehypeAddHeadingLinks)
        .use(stringify) // html to string
        .process(content); // process the markdown

    return result.toString();
}