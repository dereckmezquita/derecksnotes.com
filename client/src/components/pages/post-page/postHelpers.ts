import fs from 'fs';
import path from 'path';

import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';

// rehype remark plugins
import remarkGfm from 'remark-gfm'; // github flavoured markdown
import remarkUnwrapImages from 'remark-unwrap-images'; // removes p tag around images
import remarkExternalLinks from 'remark-external-links'; // adds target="_blank" to external links
import remarkMath from 'remark-math'; // allows math in mdx

// TOOD: uninstall: import rehypeRaw from 'rehype-raw'; // allows html in mdx
import rehypePrettyCode from 'rehype-pretty-code'; // syntax highlighting
import rehypeSlug from 'rehype-slug'; // adds id to headers
import rehypeMathjax from 'rehype-mathjax';

// custom plugins
import remarkToc from '@utils/remark/remarkToc'; // generates TOC without removing leading paragraph
import rehypeTocCollapse from '@utils/rehype/rehypeTocCollapse';
import rehypeAddHeadingLinks from '@utils/rehype/rehypeAddHeadingLinks';
import rehypeDropCap from '@utils/rehype/rehypeDropCap';

import { theme } from '@styles/theme';
import { ROOT } from '@constants/config';

interface FrontMatter {
    slug?: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;
}

export const getSidebarData = (section: string) => {
    const items = fs.readdirSync(path.join(ROOT, 'content', section), { withFileTypes: true });

    // Filter only files
    const postSlugs = items
        .filter(item => item.isFile())
        .filter(file => file.name.endsWith('.mdx'))
        .map(file => file.name);

    const side_bar_data = postSlugs.map(slug => {
        const file_content = fs.readFileSync(path.join(ROOT, 'content', section, slug), 'utf-8');
        const { data, content } = matter(file_content) as matter.GrayMatterFile<string>;

        // data.date = data.date.toString();
        // format date as 2023-12-31
        data.date = new Date(data.date).toISOString().slice(0, 10);

        return {
            slug: slug.replace('.mdx', ''),
            ...data as FrontMatter
        };
    });

    // This just sorts the sidebar data by date, newest first.
    side_bar_data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return side_bar_data;
};

export const getMDXSource = async (section: string, slug: string): Promise<{ frontmatter: FrontMatter, source: any }> => {
    const content = fs.readFileSync(path.join(ROOT, 'content', section, `${slug}.mdx`), 'utf-8');
    // const { data, content: mdxContent } = matter(content); // not sure if should pass just content

    const mdxSource = await serialize(content, {
        parseFrontmatter: true,
        mdxOptions: {
            remarkPlugins: [
                remarkGfm,
                remarkUnwrapImages,
                remarkExternalLinks,
                remarkMath,
                remarkToc,
            ],
            rehypePlugins: [
                rehypePrettyCode,
                rehypeSlug,
                rehypeMathjax,
                rehypeTocCollapse,
                rehypeAddHeadingLinks,
                [rehypeDropCap, {
                    float: 'left',
                    fontSize: '4rem',
                    fontFamily: 'Georgia, serif',
                    lineHeight: '40px',
                    marginRight: '0.1em',
                    color: theme.theme_colours[5](),
                }],
            ]
        }
    });

    // serialize date object in frontmatter
    mdxSource.frontmatter.date = new Date(mdxSource.frontmatter.date as string).toISOString().slice(0, 10);

    // add slug
    mdxSource.frontmatter.slug = slug;

    return {
        frontmatter: mdxSource.frontmatter as unknown as FrontMatter,
        source: JSON.parse(JSON.stringify(mdxSource)), // for dates to be parsed to strings? not sure if needed
    };
};

export const getAllSlugs = (section: string) => {
    const posts = fs.readdirSync(path.join(ROOT, 'content', section))
        .filter(post => post.endsWith('.mdx')); // Only include .mdx files

    return posts.map(post => ({ params: { slug: post.replace('.mdx', '') } }));
};
