import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import get_post_metadata from '@helpers/get_post_metadata';

const getPostContent = (slug: string) => {
    const folder = 'blog/';
    const file = `${folder}${slug}.md`;
    const content = fs.readFileSync(file, 'utf8');
    return matter(content);
}

// a next function to generate static paths for the dynamic pages
export const generateStaticParams = () => {
    const posts = get_post_metadata();
    return posts.map((post) => {
        return { slug: post.slug }
    });
}

const PostPage = (props: any) => {
    const slug = props.params.slug;
    const post = getPostContent(slug);

    return (
        <>
            <h1>{post.data.title}</h1>
            <Markdown>
                {post.content}
            </Markdown>
        </>
    )
}

export default PostPage;