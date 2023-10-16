Hi we previously wrote some remark/rehype plugin functions. Now I want us to write another. Here I want us to take the input in markdown and convert it to a styled alert to be displayed.

I will start by giving the examples of what we want the final output to look like.

Here is the output from github for a NOTE alert:
```css
.markdown-alert.markdown-alert-note {
border-left-color: var(--color-accent-fg);
}
syntax-theme-codemirror.scss:12.markdown-alert {
padding: 0 1em;
margin-bottom: 16px;
color: inherit;
border-left: .25em solid var(--color-border-default);
}
color-modes.scss:94* {
box-sizing: border-box;
}
HTML Attributesdiv.markdown-alert.markdown-alert-note {
unicode-bidi: isolate;
}
User Agent Style Sheetaddress, article, aside, div, footer, header, hgroup, main, nav, section {
display: block;
}
Pseudo-Element ::selection
syntax-theme-codemirror.scss:12[data-color-mode=light][data-light-theme*=dark] ::selection, [data-color-mode=dark][data-dark-theme*=dark] ::selection {
background-color: var(--color-accent-muted);
}
Inherited From td.d-block.comment-body.markdown-body.js-comment-body
syntax-theme-codemirror.scss:12.comment-body {
font-size: 14px;
color: var(--color-fg-default);
}
color-modes.scss:94.markdown-body {
font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
font-size: 16px;
line-height: 1.5;
word-wrap: break-word;
}
Inherited From table.d-block.user-select-contain
syntax-theme-codemirror.scss:12.user-select-contain {
-webkit-user-select: contain;
}
color-modes.scss:94table {
border-spacing: 0;
border-collapse: collapse;
}
User Agent Style Sheettable {
border-collapse: separate;
-webkit-border-horizontal-spacing: 2px;
-webkit-border-vertical-spacing: 2px;
text-indent: initial;
}
```
```html
<div class="markdown-alert markdown-alert-note" dir="auto"><p dir="auto"><span class="color-fg-accent text-semibold d-inline-flex flex-items-center mb-1"><svg class="octicon octicon-info mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>Note</span><br>
Highlights information that users should take into account, even when skimming.</p></div>
```
Here is the output from github for an IMPORTANT alert:
```html
<div class="markdown-alert markdown-alert-important" dir="auto"><p dir="auto"><span class="color-fg-done text-semibold d-inline-flex flex-items-center mb-1"><svg class="octicon octicon-report mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Important</span><br>
Crucial information necessary for users to succeed.</p></div>
```
Here is the output from github for a warning alert:
```html
<div class="markdown-alert markdown-alert-warning" dir="auto"><p dir="auto"><span class="color-fg-attention text-semibold d-inline-flex flex-items-center mb-1"><svg class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Warning</span><br>
Critical content demanding immediate user attention due to potential risks.</p></div>
```

Note that the stylings are virually the same between NOTE, IMPORTANT, and WARNING alerts the only thing that changes are the colours of the alert icon and the text:

- NOTE: rgb(47, 129, 247);
- IMPORTANT: rgb(163, 113, 247);
- WARNING: rgb(210, 153, 34);

The markdown input should be as such:

```markdown
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.
```

The html from the above markdown after processing looks as such:

```html
<blockquote>
<p>[!NOTE]
Highlights information that users should take into account, even when skimming.</p>
</blockquote>
<blockquote>
<p>[!IMPORTANT]
Crucial information necessary for users to succeed.</p>
</blockquote>
<blockquote>
<p>[!WARNING]
Critical content demanding immediate user attention due to potential risks.</p>
</blockquote>
```

As a reminder my markdown is currently being processed by this function:

```ts
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

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax'

import { rehypeDropCap, rehypeStyleToc, rehypeAddHeadingLinks } from './rehype';

export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown) // parse markdown
        .use(remarkMath)
        .use(remarkGfm) // github flavored markdown
        .use(remarkUnwrapImages) // remove image wrapper
        .use(rehypeExternalLinks) // add target="_blank" to external links
        .use(remarkToc) // add table of contents
        .use(remark2rehype) // markdown to html
        .use(rehypeMathjax)
        .use(rehypeDropCap, {
            float: 'left',
            fontSize: '4.75em',
            fontFamily: 'Georgia, serif',
            lineHeight: '45px',
            marginRight: '0.1em',
            color: theme.theme_colours[5](),
        })
        .use(rehypeStyleToc)
        .use(rehypeRaw) // allows html in markdown
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(rehypeAddHeadingLinks)
        .use(stringify) // html to string
        .process(content); // process the markdown

    return result.toString();
}
```

Now I want you to first discuss and then make a decision if our plugin for adding support for these styled alerts should be a rehype or remark plugin. Then I want you to propose the code for a function that will add these alerts both the html and the css within the same function, please create elements and then in the properties.style add the css styles please.

We want to match the output from github as closely as possible however, we don't need all of their classnames etc. we just want it to look visually the same.

For inspiration here is a function we previously wrote that adds links to headings in my output using rehype:

```ts
// add links to headings using the id generated by rehype-slug
// <h2 id="some-id">Some id</h2>
// we want the result to be as
// <h1 id="some-id">
//     <a aria-hidden="true" tabindex="-1" href="#some-id"><span># </span>Lorem ipsum</a>
// </h1>
export function rehypeAddHeadingLinks() {
    return (tree: Node) => {

        // Step 1: Define addHeadingLinks function
        const addHeadingLinks = (node: Node) => {

            // Check if the current node is a heading element
            if (node.type === 'element' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes((node as any).tagName)) {
                const id = (node as any).properties.id;

                // Create link element
                const link = {
                    type: 'element',
                    tagName: 'a',
                    properties: {
                        ariaHidden: 'true',
                        tabIndex: '-1',
                        href: `#${id}`,
                        style: `
                            text-decoration: none;
                            font-size: 0.9em;
                        `,
                        className: ['icon', 'icon-link'],
                    },
                    children: [{
                        type: 'element',
                        tagName: 'img',
                        properties: {
                            src: '/site-images/icons/link-icon.png', // base64 encoded green pushpin image
                            alt: `Link to heading ${id}`,
                            style: `
                                height: 0.8em;
                                padding-left: 0.2em;
                            `,
                        },
                    }],
                };

                // Append link to the heading
                (node as any).children.push(link);
            }

            if ('children' in node) {
                (node.children as Node[]).forEach(addHeadingLinks);
            }
        };

        // Step 2: Call addHeadingLinks function
        addHeadingLinks(tree);
    };
}
```
Finally I plane to use the plugin as such:

```ts
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

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax'

import { rehypeDropCap, rehypeStyleToc, rehypeAddHeadingLinks, rehypeStyledAlerts } from './rehype';

export const process_markdown = async (content: string): Promise<string> => {
    const result = await unified()
        .use(markdown) // parse markdown
        .use(remarkMath)
        .use(remarkGfm) // github flavored markdown
        .use(remarkUnwrapImages) // remove image wrapper
        .use(rehypeExternalLinks) // add target="_blank" to external links
        .use(remarkToc) // add table of contents
        .use(remark2rehype) // markdown to html
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
        .use(rehypeStyleToc)
        .use(rehypeRaw) // allows html in markdown
        .use(rehypeSlug)
        .use(rehypePrettyCode)
        .use(rehypeAddHeadingLinks)
        .use(stringify) // html to string
        .process(content); // process the markdown

    return result.toString();
}
```