import React from 'react';
import fs from 'fs';
import path from 'path';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { processMdx } from '@components/utils/mdx/processMdx';
import { Dictionary } from '@components/components/pages/dictionaries/Dictionary';
import { accessReadFile } from '@components/utils/accessReadFile';

const dictionary: string = 'biology';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

APPLICATION_DEFAULT_METADATA.title = 'DN | Biology Dictionary';
APPLICATION_DEFAULT_METADATA.description =
    'A comprehensive interactive biology dictionary.';
APPLICATION_DEFAULT_METADATA.url = new URL(
    path.join('dictionaries', dictionary),
    APPLICATION_DEFAULT_METADATA.url
).toString();

async function Page() {
    const filePaths: string[] = fs.readdirSync(absDir);
    const definitions: Definition[] = await Promise.all(
        filePaths.map(async (filename) => {
            const currPath = path.join(absDir, filename);
            const markdown = await accessReadFile(currPath);
            // TODO: related to blog/[slug]/page.tsx reconsider if this should be an error
            if (!markdown) {
                throw new Error(`Could not read file ${currPath}`);
            }
            const { source, frontmatter } =
                await processMdx<DefinitionMetadata>(markdown);

            frontmatter.url = APPLICATION_DEFAULT_METADATA.url;
            frontmatter.slug = path.basename(filename, '.mdx');

            return {
                source,
                frontmatter
            };
        })
    );

    // filter out any definitions that are not published
    const definitions2: Definition[] = definitions
        .filter((definition) => definition.frontmatter.published)
        .sort((a, b) => {
            const letterA = a.frontmatter.letter.toLowerCase();
            const letterB = b.frontmatter.letter.toLowerCase();

            const isLetterA = /^[a-z]$/.test(letterA);
            const isLetterB = /^[a-z]$/.test(letterB);

            if (isLetterA && isLetterB) {
                return letterA.localeCompare(letterB);
            } else if (isLetterA) {
                return -1;
            } else if (isLetterB) {
                return 1;
            } else {
                return letterA.localeCompare(letterB);
            }
        });

    return (
        <Dictionary
            definitions={definitions2}
            pageMetadata={APPLICATION_DEFAULT_METADATA}
        />
    );
}

export default Page;

export interface Definition {
    source: React.ReactNode;
    frontmatter: DefinitionMetadata;
}

export interface DefinitionMetadata {
    slug: string;
    letter: string;
    word: string;
    dictionary: string;
    category: string;
    dataSources: string;

    published: boolean;
    comments: boolean;

    linksTo: string[];
    linkedFrom: string[];

    // used during build
    url: string;
}
