import fs from 'fs';
import path from 'path';
import { APPLICATION_DEFAULT_METADATA, ROOT_DIR_APP } from '@lib/constants';
import { processMdx } from '@utils/mdx/processMdx';
import { notFound } from 'next/navigation';
import { Post } from '@components/pages/Post';
import {
    PostMetadata,
    extractSinglePostMetadata,
    getSideBarPosts
} from '@utils/mdx/fetchPostsMetadata';
import { accessReadFile } from '@utils/accessReadFile';
import { Metadata } from 'next';
import { decodeSlug } from '@utils/helpers';

const section: string = 'references';
const relDir = path.join(section, 'posts');
const absDir = path.join(ROOT_DIR_APP, relDir);

// used at build time to generate which pages to render
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const items: string[] = fs.readdirSync(absDir);
    const mdx: string[] = items.filter((item) => item.endsWith('.mdx'));

    const seriesDirs = items.filter((item) =>
        fs.statSync(path.join(absDir, item)).isDirectory()
    );

    // For directories, take the first MDX file as a representative post
    seriesDirs.forEach((seriesDir) => {
        if (['drafts', 'deprecated', 'ignore'].includes(seriesDir)) {
            return;
        }
        const seriesItems: string[] = fs.readdirSync(
            path.join(absDir, seriesDir)
        );
        const mdxFiles: string[] = seriesItems.filter((item) =>
            item.endsWith('.mdx')
        );

        if (mdxFiles.length === 0) {
            return;
        }

        mdxFiles.sort();
        mdx.push(path.join(seriesDir, mdxFiles[0]));
    });

    return mdx.map((file) => {
        // Remove the .mdx extension
        const noExt = file.replace('.mdx', '');
        // Split by path separator to handle nested directories
        const segments = noExt.split(path.sep);
        return { slug: segments };
    });
}

async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    // Decode each segment
    const decodedSegments = (await params).slug.map(decodeSlug);
    // Join segments to form the relative path to the file
    const absPath: string = path.join(absDir, ...decodedSegments) + '.mdx';

    const sideBarPosts = getSideBarPosts(section);
    const markdown = await accessReadFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } = await processMdx<PostMetadata>(markdown);

    if (!frontmatter.published) {
        notFound();
    }

    const decodedSlug = decodedSegments.join('/');
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

    // Set global metadata (though Next.js recommends using generateMetadata instead)
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

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const decodedSegments = (await params).slug.map(decodeSlug);
    const filePath: string = path.join(absDir, ...decodedSegments) + '.mdx';
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
