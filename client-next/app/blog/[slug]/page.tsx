import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import get_post_metadata from '@helpers/get_post_metadata';

import remarkGfm from 'remark-gfm'; // allows github flavored markdown
import rehypeRaw from "rehype-raw"; // allows raw html in markdown
import rehypeSlug from 'rehype-slug'; // adds id to headings
import remarkUnwrapImages from 'remark-unwrap-images'; // removes p tag around images
import remarkExternalLinks from 'remark-external-links'; // manage external links
import remarkToc from 'remark-toc'

const get_post_content = (slug: string) => {
    const folder = 'blog/';
    const file = `${folder}${slug}.md`;
    const content = fs.readFileSync(file, 'utf8');
    return matter(content);
}

// a next function to generate static paths for the dynamic pages
export const generateStaticParams = (): Array<{ slug: string }> => {
    const posts = get_post_metadata();
    return posts.map((post: PostMetadata) => {
        return { slug: post.slug }
    });
}

const PostPage = (props: any) => {
    const slug = props.params.slug;
    const post = get_post_content(slug);

    return (
        <>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkUnwrapImages, remarkExternalLinks, remarkToc]}
                rehypePlugins={[rehypeRaw, rehypeSlug]}
            >
                {post.content}
            </ReactMarkdown>
        </>
    )
}

export default PostPage;