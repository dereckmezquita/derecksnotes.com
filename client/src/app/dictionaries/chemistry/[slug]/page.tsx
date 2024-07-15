import fs from 'fs';
import path from 'path';
import { Post } from '@components/components/pages/Post';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import {
    DefinitionMetadata,
    extractSingleDefinitionMetadata,
    fetchDefintionsMetadata
} from '@components/utils/dictionaries/fetchDefinitionMetadata';
import { accessReadFile } from '@components/utils/accessReadFile';
import { notFound } from 'next/navigation';
import { processMdx } from '@components/utils/mdx/processMdx';
import { Metadata } from 'next';

const dictionary: string = 'chemistry';
const relDir: string = path.join('dictionaries', dictionary, 'definitions');
const absDir: string = path.join(ROOT_DIR_APP, relDir);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    // only pre-render first 3 definitions
    const filenames: string[] = fs
        .readdirSync(absDir)
        .filter((filename) => {
            return filename.endsWith('.mdx');
        })
        .slice(0, 3);

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
    const sideBarDefintiions = fetchDefintionsMetadata(absDir);

    const absPath: string = path.join(absDir, params.slug + '.mdx');

    const markdown = await accessReadFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } =
        await processMdx<DefinitionMetadata>(markdown);

    if (!frontmatter.published) {
        notFound();
    }

    const url: string = new URL(
        path.join('dictionaries', dictionary, 'definitions', params.slug),
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

export function generateMetadata({ params }: PageProps): Metadata {
    const filename: string = params.slug + '.mdx';
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
