I have this code for a [slug].tsx page on my nextjs website using typescript and react-components. 

```tsx
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

// redux for tag filter visibility
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import TagFilter from '@components/ui/TagFilter';
import {
    PostContainer, SideBarContainer, SideBarSiteName, SideBarEntriesContainer, SideEntryLink, SideBarAboutContainer, SideBarAboutH2, Article, MDXPostContent
} from '@components/ui/DisplayContent';


// component imports to be used in MDX
import CaptionedFigure from '@components/ui/post-elements/CaptionedFigure';
import DropCap from '@components/ui/DropCap';
import Alert from '@components/ui/post-elements/Alert';

const components = {
    CaptionedFigure: CaptionedFigure,
    DropCap: DropCap,
    Alert: Alert,
};

const section: string = 'blog';

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

interface PostPageProps {
    title: string;
    source: any;
    side_bar_data: FrontMatter[];
}

const PostPage: React.FC<PostPageProps> = ({ title, source, side_bar_data }) => {
    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // tag filter
    const all_tags: string[] = Array.from(new Set(side_bar_data.flatMap(post => post.tags))).sort();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: FrontMatter[] = selectedTags.length > 0 ? side_bar_data.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : side_bar_data;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    // redux control for tag filter visibility
    const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

    return (
        <>
            <TagFilter
                tags={all_tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                visible={tagsFilterVisible}
            />
            <PostContainer>
                <SideBarContainer>
                    <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                    <SideBarEntriesContainer>
                        {filteredPosts.map((meta) => (
                            <SideEntryLink
                                key={meta.slug}
                                href={`/${section}/${meta.slug}`}
                                passHref
                            >
                                <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                            </SideEntryLink>
                        ))}
                    </SideBarEntriesContainer>
                    <SideBarAboutContainer>
                        <SideBarAboutH2>About</SideBarAboutH2>
                        <p>
                            This website is custom made by Dereck using React, Next.js, and TypeScript. It incorporates progressive web app technologies an relies on a NodeJS backend along with a MongoDB database.
                        </p>
                        <p>
                            If you'd like to know more you can find the full source code on <a href='https://github.com/dereckmezquita/derecksnotes.com'>github.com/dereckmezquita/derecksnotes.com</a>
                        </p>
                    </SideBarAboutContainer>
                </SideBarContainer>
                <Article>
                    <h1>{title}</h1>
                    {isClient && <MDXPostContent {...source} components={components} />}
                </Article>
            </PostContainer>
        </>
    );
}

// ----------------------------------------
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

// TODO: not working yet
import remarkTocCollapse from '@utils/remark/remarkTocCollapse';
// Error: [next-mdx-remote] error compiling MDX:
// Cannot handle unknown node `raw`

// More information: https://mdxjs.com/docs/troubleshooting-mdx
import rehypeAddHeadingLinks from '@utils/rehype/rehypeAddHeadingLinks';
// Error: Expected `onMouseOver` listener to be a function, instead got a value of `string` type.


export const getStaticProps: GetStaticProps = async ({ params }) => {
    // get side bar metadata
    const sidebar_files: string[] = fs.readdirSync(path.join(ROOT, 'content', section))
        .filter((fn) => fn.endsWith('.mdx'));
    const side_bar_data = sidebar_files.map((file_name) => {
        const file_content: string = fs.readFileSync(path.join(ROOT, 'content', section, file_name), 'utf8');
        const { data, content } = matter(file_content) as matter.GrayMatterFile<string>;

        // data.date = data.date.toString();
        // format date as 2023-12-31
        data.date = new Date(data.date).toISOString().slice(0, 10);

        return {
            slug: file_name.replace('.mdx', ''),
            ...data as FrontMatter
        }
    })

    // sort by date descending
    side_bar_data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // get post content and process
    const post_file_path: string = path.join(ROOT, 'content', section, `${params!.slug}.mdx`);
    const file_content: string = fs.readFileSync(post_file_path, 'utf8');
    const mdxSource = await serialize(file_content, {
        parseFrontmatter: true,
        mdxOptions: {
            remarkPlugins: [
                remarkGfm,
                remarkUnwrapImages,
                remarkExternalLinks,
                remarkMath,
                // remarkTocCollapse,
            ],
            rehypePlugins: [
                rehypePrettyCode,
                rehypeSlug,
                rehypeMathjax,
                // rehypeAddHeadingLinks,
            ]
        }
    });

    // if not published, return 404
    if (!mdxSource.frontmatter.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            title: mdxSource.frontmatter.title,
            source: JSON.parse(JSON.stringify(mdxSource)),
            side_bar_data: side_bar_data
        },
    };
}

// ----------------------------------------
// the goal of this function getStaticPaths is to
// return a list of all possible values for slug
// so that nextjs can pre-render all the possible
import path from 'path';
import fs from 'fs';
import { ROOT } from '@constants/misc';

export const getStaticPaths: GetStaticPaths = async () => {
    const posts: string[] = fs.readdirSync(path.join(ROOT, 'content', section));
    const paths = posts.map(post => ({
        params: { slug: post.replace('.mdx', '') }
    }));

    return {
        paths,
        fallback: false
    };
}

export default PostPage;
```

I want to use this plugin `remarkTocCollapse` I wrote but I keep getting this error please help:

```ts
// https://github.com/ShuntaH/remark-toc-collapse/blob/main/index.js
import { toc, Options as TocOptions } from 'mdast-util-toc';
import { Root } from 'mdast';
import { Node } from 'mdast-util-toc/lib'
import { Plugin } from 'unified';

interface RemarkTocCollapseOptions extends TocOptions {
    heading?: string;
}

/**
 * Plugin to generate a Table of Contents (TOC).
 */
const remarkTocCollapse: Plugin<[(RemarkTocCollapseOptions | undefined)?], Root> = (options = {}) => {
    return (node: Node) => {
        const result = toc(
            node as Root,
            Object.assign({}, options, {
                heading: options.heading || 'toc|table[ -]of[ -]contents?'
            })
        );

        if (
            result.endIndex === null ||
            result.index === null ||
            result.index === -1 ||
            !result.map
        ) {
            return;
        }

        if ('children' in node) {
            node.children.splice(result.index - 1, 1);

            node.children = [
                ...node.children.slice(0, result.index - 1),
                {
                    type: 'html',
                    value: `<details style="padding-bottom: 15px;">`
                },
                {
                    type: 'html',
                    value: '<summary>'
                },
                {
                    type: 'html',
                    value: `
                        <h3 id="table-of-contents" style="display: inline-block; margin: 0px; padding: 0px; padding-bottom: 15px;">
                            Table of Contents
                        </h3>
                    `
                },
                {
                    type: 'html',
                    value: '</summary>'
                },
                result.map,
                {
                    type: 'html',
                    value: '</details>'
                },
                ...node.children.slice(result.index - 1)
            ];
        }
    };
};

export default remarkTocCollapse;
```

 1 of 1 unhandled error
Server Error
Error: [next-mdx-remote] error compiling MDX:
Cannot handle unknown node `raw`

More information: https://mdxjs.com/docs/troubleshooting-mdx
This error happened while generating the page. Any console logs will be displayed in the terminal window.

---

I tried changing the type to jsx from html and that renders the page but I get these elements being rendered as text on the webpage instead of being rendered as html.

I searched online and someone suggested that this is the problem:

"remark-html-to-jsx finds any nodes with the type html (which is what remark-shiki-twoslash outputs) and converts that html into JSX nodes by using reacts dangerouslySetInnerHTML property. It's a total hack, but it works great for my needs. Figured I'd share:"

Here is his code:

```js
// @ts-check

function remarkPlugin() {
  async function transform(...args) {
    // Async import since these packages are all in ESM
    const { visit, SKIP } = await import("unist-util-visit");
    const { mdxFromMarkdown } = await import("mdast-util-mdx");
    const { fromMarkdown } = await import("mdast-util-from-markdown");
    const { mdxjs } = await import("micromark-extension-mdxjs");

    // This is a horror show, but it's the only way I could get the raw HTML into MDX.
    const [ast] = args;
    visit(ast, "html", (node) => {
      const escapedHtml = JSON.stringify(node.value);
      const jsx = `<div dangerouslySetInnerHTML={{__html: ${escapedHtml} }}/>`;
      const rawHtmlNode = fromMarkdown(jsx, {
        extensions: [mdxjs()],
        mdastExtensions: [mdxFromMarkdown()],
      }).children[0];

      Object.assign(node, rawHtmlNode);

      return SKIP;
    });
  }

  return transform;
}

module.exports = remarkPlugin;
```

What can we learn from this and can we find a way to update our plugin to work with mdx?