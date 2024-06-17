import { theme } from '@components/styles/theme';

import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm'; // github flavoured md
import remarkMath from 'remark-math'; // allows maths in mdx
import remarkUnwrapImages from 'remark-unwrap-images'; // removes p tag around images
import rehypeMathJax from 'rehype-mathjax'; // renders maths
import remarkExternalLinks from 'remark-external-links'; // adds target="_blank" to external links
import rehypeSlug from 'rehype-slug'; // adds id to headings

// custom plugins
import remarkToc from '../remark-rehype/remarkToc'; // generates TOC without removing leading p
import rehypeTocCollapse from '../remark-rehype/rehypeTocCollapse';
import rehypeAddHeadingLinks from '../remark-rehype/rehypeAddHeadingLinks';
import rehypeDropCap from '../remark-rehype/rehypeDropCap';

import { PostMetadata } from './fetchPostsMetadata';
import { compileMDX } from 'next-mdx-remote/rsc';

const rehypePrettyCodeOptions: Partial<Options> = {
    theme: 'github-dark-dimmed',
    defaultLang: 'plaintext'
};

export async function processMdx(markdown: string) {
    const { content, frontmatter } = await compileMDX<PostMetadata>({
        source: markdown,
        options: {
            parseFrontmatter: true,
            // REF: https://github.com/hashicorp/next-mdx-remote/issues/356#issuecomment-1556074660
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    remarkUnwrapImages,
                    remarkMath,
                    remarkExternalLinks,
                    remarkToc
                ],
                rehypePlugins: [
                    rehypeExternalLinks,
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                    rehypeSlug,
                    rehypeMathJax,
                    rehypeTocCollapse,
                    rehypeAddHeadingLinks,
                    [
                        rehypeDropCap,
                        {
                            float: 'left',
                            fontSize: '4rem',
                            fontFamily: 'Georgia, serif',
                            lineHeight: '40px',
                            marginRight: '0.1em',
                            color: theme.theme_colours[5]()
                        }
                    ]
                ]
            }
        }
    });

    frontmatter.date = new Date(frontmatter.date as string)
        .toISOString()
        .slice(0, 10);

    return {
        frontmatter: frontmatter,
        source: content
    };
}
