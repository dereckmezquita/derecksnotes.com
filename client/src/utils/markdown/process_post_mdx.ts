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

import remarkTocCollapse from '../remark/remarkTocCollapse';
import rehypeDropCap from '../rehype/rehypeDropCap';
import rehypeAddHeadingLinks from '../rehype/rehypeAddHeadingLinks';
import rehypeStyledAlerts from '../rehype/rehypeStyledAlerts';
import remarkCaptions from 'remark-captions';

import { theme } from '@styles/theme';

export default async function process_post_mdx(content: string): Promise<string> {
    const result = await unified()
        .use(markdown) // parse markdown
        .use(remarkMath)
        .use(remarkGfm) // github flavored markdown
        .use(remarkUnwrapImages) // remove image wrapper
        .use(remarkExternalLinks) // add target="_blank" to external links
        .use(remarkTocCollapse)
        .use(remarkCaptions, {
            internal: {
                blockquote: 'Source:',
                image: 'Figure:',
            }
        })
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