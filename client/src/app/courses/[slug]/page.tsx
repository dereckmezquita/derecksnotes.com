import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { processMdx } from '@components/utils/mdx/processMdx';
import { notFound } from 'next/navigation';
import { Post } from '../../../components/pages/Post';
import {
    PostMetadata,
    extractSinglePostMetadata,
    getPostsWithSection
} from '@components/utils/mdx/fetchPostsMetadata';
import { accessReadFile } from '@components/utils/accessReadFile';

const section: string = 'courses';
const absDir = path.join(ROOT_DIR_APP, section, 'posts');

// used at build time to generate which pages to render
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const filenames: string[] = fs.readdirSync(absDir);

    return filenames.map((filename) => {
        const slug = path.basename(filename, '.mdx');
        return {
            slug
        };
    });
}

interface PageProps {
    params: { slug: string };
}

async function Page({ params }: PageProps) {
    const sideBarPosts = getPostsWithSection(section);

    const absPath: string = path.join(
        ROOT_DIR_APP,
        section,
        'posts',
        params.slug + '.mdx'
    );

    const markdown = await accessReadFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } = await processMdx<PostMetadata>(markdown);

    if (!frontmatter.published) {
        notFound();
    }

    APPLICATION_DEFAULT_METADATA.url = new URL(
        path.join(section, params.slug),
        APPLICATION_DEFAULT_METADATA.url
    ).toString();

    const frontmatter2: PostMetadata = {
        ...extractSinglePostMetadata(absPath),
        section,
        url: APPLICATION_DEFAULT_METADATA.url
    };

    if (!frontmatter2.summary) {
        throw new Error(`Post ${frontmatter.slug} is missing a summary`);
    }

    APPLICATION_DEFAULT_METADATA.title = frontmatter2.title;
    APPLICATION_DEFAULT_METADATA.description = frontmatter2.summary;
    APPLICATION_DEFAULT_METADATA.image =
        '/site-images/card-covers/' + frontmatter2.coverImage + '.png';

    return (
        <Post
            source={source}
            frontmatter={frontmatter2}
            sideBarPosts={sideBarPosts}
        />
    );
}

export default Page;

export function generateMetadata({ params }: any) {
    const filePath: string = path.join(absDir, params.slug + '.mdx');
    const post: PostMetadata = extractSinglePostMetadata(filePath);
    return {
        title: `Dn | ${post.title}`,
        description: post.summary,
        openGraph: {
          title: post.title,
          description: post.summary,
          images: [post.coverImage],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.summary,
          image: post.coverImage,
        },
      };
}