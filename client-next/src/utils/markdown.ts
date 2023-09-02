import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';

import { remark } from 'remark';
import strip from 'strip-markdown';

import { Parent, Node } from 'unist';

import { theme } from '@styles/theme';

function onlyParagraphs() {
    return (tree: Parent) => {
        return {
            type: 'root',
            children: tree.children.filter(node => node.type === 'paragraph')
        };
    };
}

export const get_post_metadata = (folder: string): PostMetadata[] => {
    const files = fs.readdirSync(path.join(ROOT, 'content', folder));
    const md = files.filter((fn) => fn.endsWith('.md'));
    // get gray-matter metadata
    return md.map((file_name) => {
        const file: string = path.join(ROOT, 'content', folder, file_name);
        const file_contents: string = fs.readFileSync(file, 'utf8');
        const { data, content } = matter(file_contents) as matter.GrayMatterFile<string>;

        // get the first n characters from the content; used for the summary from the post data
        const summary: string = remark() // markdown is parsed to html
            .use(onlyParagraphs)
            .use(strip) // strip all markdown formatting
            .processSync(content)
            .toString()
            .substring(0, 250);

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
// import remarkExternalLinks from 'remark-external-links';
import rehypeExternalLinks from 'rehype-external-links';
import remarkToc from 'remark-toc';

// dropcap should have these styles
import { visit } from 'unist-util-visit';


interface DropCapConfig {
    float?: string;
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
    marginRight?: string;
    color?: string;
}

function dropCap(config: DropCapConfig) {
    return (tree: Node) => {
        // find the first paragraph node
        let firstParagraphNode: Node | null = null;
        visit(tree, 'element', (node: Node, index: number, parent: Node) => {
            if (!firstParagraphNode && (node as any).tagName === 'p') {
                firstParagraphNode = node;
            }
        });

        if (firstParagraphNode) {
            const firstChild = (firstParagraphNode as any).children[0];
            if (firstChild && firstChild.type === 'text') {
                const value = firstChild.value.trim();
                const dropCapSpan = {
                    type: 'element',
                    tagName: 'span',
                    properties: {
                        style: `
                            float: ${config.float ? config.float : 'left'};
                            font-size: ${config.fontSize ? config.fontSize : '4.75em'};
                            font-family: ${config.fontFamily ? config.fontFamily : 'Georgia, serif'};
                            line-height: ${config.lineHeight ? config.lineHeight : '40px'};
                            margin-right: ${config.marginRight ? config.marginRight : '0.1em'};
                            color: ${config.color ? config.color : 'inherit'};
                        `,
                        className: ['dropcap'],
                    },
                    children: [{
                        type: 'text',
                        value: value[0]
                    }]
                };
                firstChild.value = value.slice(1);
                (firstParagraphNode as any).children.unshift(dropCapSpan);
            }
        }
    };
}

export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown) // parse markdown
        .use(remarkGfm) // github flavored markdown
        .use(remarkUnwrapImages) // remove image wrapper
        .use(rehypeExternalLinks) // add target="_blank" to external links
        .use(remarkToc) // add table of contents
        .use(remark2rehype) // markdown to html
        .use(dropCap, {
            float: 'left',
            fontSize: '4.75em',
            fontFamily: 'Georgia, serif',
            lineHeight: '45px',
            marginRight: '0.1em',
            color: theme.theme_colours[5](),
        })
        .use(rehypeRaw) // allows html in markdown
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(stringify)
        .process(content);

    return result.toString();
}
