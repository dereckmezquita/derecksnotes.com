import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const get_post_metadata = (folder: string): PostMetadata[] => {
    // const folder = 'blog/';
    const files = fs.readdirSync(folder);
    const md = files.filter((fn) => fn.endsWith('.md'));
    // get gray-matter metadata
    return md.map((file_name) => {
        // const file_contents = fs.readFileSync(`${folder}${file_name}`, 'utf8');
        const file_contents: string = fs.readFileSync(path.join(folder, file_name), 'utf8');
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
    // const folder = 'blog/';
    // const file = `${folder}${slug}.md`;
    const file: string = path.join(folder, `${slug}.md`);
    const content: string = fs.readFileSync(file, 'utf8');
    return matter(content);
}

// --------------------------------
// --------------------------------

import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import stringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import rehypeSlug from 'rehype-slug';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkExternalLinks from 'remark-external-links';
import remarkToc from 'remark-toc';

// in nextjs 13 we can use await async functions inside a component
// no need to use getStaticProps or getServerSideProps anymore
export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown)
        .use(remarkGfm)
        .use(remarkUnwrapImages)
        .use(remarkExternalLinks)
        .use(remarkToc)
        .use(remark2rehype)
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(stringify)
        .process(content);

    return result.toString();
}
