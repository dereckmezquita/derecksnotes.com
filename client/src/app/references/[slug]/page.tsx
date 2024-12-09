import fs from 'fs';
import path from 'path';
import { APPLICATION_DEFAULT_METADATA, ROOT_DIR_APP } from '@lib/constants';
import { processMdx } from '@utils/mdx/processMdx';
import { notFound } from 'next/navigation';
import { Post } from '@components/pages/Post';
import {
    PostMetadata,
    extractSinglePostMetadata,
    getPostsWithSection
} from '@utils/mdx/fetchPostsMetadata';
import { accessReadFile } from '@utils/accessReadFile';
import { Metadata } from 'next';
import { decodeSlug } from '@components/utils/helpers';

const section: string = 'references';
const relDir = path.join(section, 'posts');
const absDir = path.join(ROOT_DIR_APP, relDir);

// used at build time to generate which pages to render
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const filenames: string[] = fs.readdirSync(absDir).filter((filename) => {
        return filename.endsWith('.mdx');
    });

    return filenames.map((filename) => {
        const slug = path.basename(filename, '.mdx');
        return { slug };
    });
}

interface PageProps {
    params: { slug: string };
}

async function Page({ params }: PageProps) {
    const decodedSlug = decodeSlug(params.slug);
    const sideBarPosts = getPostsWithSection(section);

    const absPath: string = path.join(absDir, decodedSlug + '.mdx');
    const markdown = await accessReadFile(absPath);

    // TODO: review and reconsider this logic; should this be an error
    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } = await processMdx<PostMetadata>(markdown);

    if (!frontmatter.published) {
        notFound();
    }

    // TODO: simplify this we don't need full metadata object
    const url = new URL(
        path.join(section, decodedSlug),
        APPLICATION_DEFAULT_METADATA.url
    ).toString();

    const frontmatter2: PostMetadata = {
        ...extractSinglePostMetadata(absPath),
        section,
        url: url
    };

    if (!frontmatter2.summary) {
        throw new Error(`Post ${frontmatter.slug} is missing a summary`);
    }

    // TODO: cleanup this can be deleted; we set metadata now with the generateMetadata function
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

export function generateMetadata({ params }: PageProps): Metadata {
    const decodedSlug = decodeSlug(params.slug);
    const filePath: string = path.join(absDir, decodedSlug + '.mdx');
    const post: PostMetadata = extractSinglePostMetadata(filePath);
    return {
        metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
        title: `Dn | ${post.title}`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: [
                {
                    url: post.coverImage,
                    width: 800,
                    height: 600,
                    alt: "Dereck's Notes Logo"
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [post.coverImage]
        }
    };
}
