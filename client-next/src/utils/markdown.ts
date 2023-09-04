import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';

import { remark } from 'remark';
import strip from 'strip-markdown';

import { Parent } from 'unist';

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
import remarkExternalLinks from 'remark-external-links';

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax'

import remarkTocCollapse from './remark/remarkTocCollapse';
import rehypeDropCap from './rehype/rehypeDropCap';
import rehypeAddHeadingLinks from './rehype/rehypeAddHeadingLinks';
import rehypeStyledAlerts from './rehype/rehypeStyledAlerts';

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
            fontSize: '4.75em',
            fontFamily: 'Georgia, serif',
            lineHeight: '45px',
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
