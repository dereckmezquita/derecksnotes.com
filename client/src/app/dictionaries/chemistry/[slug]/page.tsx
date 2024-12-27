import fs from 'fs';
import path from 'path';
import { Post } from '@components/pages/Post';
import { APPLICATION_DEFAULT_METADATA, ROOT_DIR_APP } from '@lib/constants';
import { NEXT_PUBLIC_BUILD_ENV_BOOL } from '@lib/env';
import {
    DefinitionMetadata,
    extractSingleDefinitionMetadata,
    fetchDefintionsMetadata
} from '@utils/dictionaries/fetchDefinitionMetadata';
import { accessReadFile } from '@utils/accessReadFile';
import { notFound } from 'next/navigation';
import { processMdx } from '@utils/mdx/processMdx';
import { Metadata } from 'next';
import { decodeSlug } from '@utils/helpers';

const dictionary: string = 'chemistry';
const relDir: string = path.join('dictionaries', dictionary, 'definitions');
const absDir: string = path.join(ROOT_DIR_APP, relDir);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    let filenames: string[] = fs.readdirSync(absDir).filter((filename) => {
        return filename.endsWith('.mdx');
    });

    // if NEXT_PUBLIC_BUILD_ENV_BOOL then return all
    if (!NEXT_PUBLIC_BUILD_ENV_BOOL) {
        filenames = filenames.slice(0, 3);
    }

    return filenames.map((filename) => {
        const slug = path.basename(filename, '.mdx');
        return { slug };
    });
}

async function Page({ params }: { params: { slug: string } }) {
    const decodedSlug = decodeSlug(params.slug);

    const absPath: string = path.join(absDir, decodedSlug + '.mdx');
    const markdown = await accessReadFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } =
        await processMdx<DefinitionMetadata>(markdown);

    const sideBarDefintiions = fetchDefintionsMetadata(
        absDir,
        frontmatter.word
    );

    if (!frontmatter.published) {
        notFound();
    }

    const url: string = new URL(
        path.join('dictionaries', dictionary, 'definitions', decodedSlug),
        APPLICATION_DEFAULT_METADATA.url
    ).toString();

    frontmatter.url = url;

    return (
        <Post
            source={source}
            frontmatter={frontmatter}
            sideBarPosts={sideBarDefintiions}
        />
    );
}

export default Page;

export function generateMetadata({
    params
}: {
    params: { slug: string };
}): Metadata {
    const decodedSlug = decodeSlug(params.slug);
    const filename: string = decodedSlug + '.mdx';
    const filePath: string = path.join(absDir, filename);
    const definition: DefinitionMetadata =
        extractSingleDefinitionMetadata(filePath);

    const title: string = `Dn | dictionary - ${definition.word}`;
    const summary: string =
        definition.summary || `Dn | definition of ${definition.word}`;
    const coverImage: string = '/site-images/card-covers/512-logo.png';
    return {
        metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
        title: title,
        description: summary,
        openGraph: {
            title: title,
            description: summary,
            // TODO: consider setting a dynamic image per definition
            images: [
                {
                    url: coverImage,
                    width: 800,
                    height: 600,
                    alt: "Dereck's Notes Logo"
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: summary,
            images: [coverImage]
        }
    };
}
