I have a nextjs blog website I am building that uses typescript and react styled-componenets. The content is generated from markdown files.

Currently this is the function I am using to process my markdown documents:

```tsx
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

export default async function process_post_md(content: string): Promise<string> {
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
```

And this is how it's being used inside of /src/pages/blog/[slug].tsx

```tsx
import withPostPage from '@components/withPostPage';
import get_post_content from '@utils/markdown/get_post_content';
import process_post_md from '@utils/markdown/process_post_md';
import get_post_metadata from '@utils/markdown/get_post_metadata';

import { GetStaticPaths, GetStaticProps } from 'next';

const section: string = 'blog';

const PostPage = withPostPage(section);

// since getStaticProps and getStaticPaths use fs; we can't modularise them outside of pages/
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postContent = get_post_content(section, params!.slug as string);
    const content = await process_post_md(postContent.content);

    // get info for side bar
    let posts: PostMetadata[] = get_post_metadata(section);
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // remove those not published
    posts = posts.filter(post => post.published);

    // if post is not published, return 404
    if (!postContent.data.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            content,
            post: {
                ...postContent.data,
                date: postContent.data.date.toString()
            },
            posts
        }
    };    
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = get_post_metadata(section);
    const paths = posts.map(post => ({
        params: { slug: post.slug }
    }));

    return {
        paths,
        fallback: false
    };
};

export default PostPage;
```

And finally here is the code for `withPostPage`; notice how we're passing the processed content to as `dangerouslySetInnerHTML`:

```tsx
import React, { useState } from 'react';
import TagFilter from '@components/ui/TagFilter';

import {
    PostContainer, SideBarContainer, SideBarSiteName, SideBarEntriesContainer, SideEntryLink, SideBarAboutContainer, SideBarAboutH2, Article, PostContent
} from '@components/ui/DisplayContent';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

interface PostPageProps {
    content: string;
    post: PostMetadata;
    posts: PostMetadata[];
};

// reminder this returns a function
// this function is used in [slug].tsx and uses post, posts which are global variables
// these variables are passed by getStaticProps
export default function withPostPage(section: string): React.FC<PostPageProps> {
    const PostPage: React.FC<PostPageProps> = ({ content, post, posts }) => {
        const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

        const [selectedTags, setSelectedTags] = useState<string[]>([]);

        // if no tags selected, show all posts
        const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
            post => selectedTags.some(tag => post.tags.includes(tag))
        ) : posts;

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
                    tags={allTags}
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
                        <h1>{post.title}</h1>
                        <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                    </Article>
                </PostContainer>
            </>
        );
    };

    return PostPage;
};
```

I want to instead use mdx for my content. How can I revise my code to use mdx instead? Should we also refactor the `withPostPage` function and how we pass the processed content to it?

These are questions I have, you are the teacher I am learning.

Please revise my code, and explain it. I am learning you are the teacher.