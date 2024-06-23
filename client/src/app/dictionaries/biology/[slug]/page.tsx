import fs from 'fs';
import path from 'path';
import { Post } from '@components/components/pages/Post';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import {
    DefinitionMetadata,
    fetchDefintionsMetadata
} from '@components/utils/dictionaries/fetchDefinitionMetadata';
import { accessReadFile } from '@components/utils/accessReadFile';
import { notFound } from 'next/navigation';
import { URL } from 'url';
import { processMdx } from '@components/utils/mdx/processMdx';

const dictionary: string = 'biology';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const filenames: string[] = fs.readdirSync(absDir).filter((filename) => {
        return filename.endsWith('.mdx');
    });

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
