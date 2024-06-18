import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { readFile, access } from 'fs/promises';
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
    fetchPostsMetadata
} from '@components/utils/mdx/fetchPostsMetadata';

const section: string = 'courses';
const absDir = path.join(ROOT_DIR_APP, section, 'posts');

async function readPostFile(filePath: string) {
    try {
        await access(filePath);
    } catch (err) {
        return undefined;
    }

    return await readFile(filePath, { encoding: 'utf-8' });
}

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
    params: { slug: string, sideBarPosts: PostMetadata[] };
}

async function Page({ params }: PageProps) {
    const sideBarPosts = fetchPostsMetadata(absDir);

    const absPath: string = path.join(
        ROOT_DIR_APP,
        section,
        'posts',
        params.slug + '.mdx'
    );

    const markdown = await readPostFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } = await processMdx(markdown);

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
            pageMetadata={APPLICATION_DEFAULT_METADATA}
            sideBarPosts={sideBarPosts}
        />
    );
}

export default Page;
