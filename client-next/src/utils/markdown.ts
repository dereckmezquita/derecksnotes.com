import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';


import { remark } from 'remark';
import strip from 'strip-markdown';

import { Parent } from 'unist';

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
        const summary: string = remark()
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

export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown)
        .use(remarkGfm)
        .use(remarkUnwrapImages)
        .use(rehypeExternalLinks)
        .use(remarkToc)
        .use(remark2rehype)
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(stringify)
        .process(content);

    return result.toString();
}
