import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ROOT } from '@constants/misc';

export const get_post_metadata = (folder: string): PostMetadata[] => {
    const files = fs.readdirSync(path.join(ROOT, folder));
    const md = files.filter((fn) => fn.endsWith('.md'));
    // get gray-matter metadata
    return md.map((file_name) => {
        // const file_contents = fs.readFileSync(`${folder}${file_name}`, 'utf8');
        const file_contents: string = fs.readFileSync(path.join(ROOT, folder, file_name), 'utf8');
        const { data } = matter(file_contents);
        return {
            title: data.title,
            subtitle: data.subtitle,
            // to date format YYYT-MM-DD HH:MM:SS
            date: typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0],
            slug: file_name.replace('.md', '')
        };
    });
}

// --------------------------------
// --------------------------------

export const get_post_content = (folder: string, slug: string): matter.GrayMatterFile<string> => {
    folder = path.join(ROOT, folder);
    const file: string = path.join(folder, `${slug}.md`);
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
