import fs from 'fs';
import path from 'path';
import { accessReadFile } from '../accessReadFile';
import { processMdx } from '../mdx/processMdx';

import { APP_URL } from '@components/lib/env';

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

export async function fetchAllDefintions(dir: string): Promise<Definition[]> {
    const filePaths: string[] = fs.readdirSync(dir);
    const definitions: Definition[] = await Promise.all(
        filePaths.map(async (filename) => {
            const currPath = path.join(dir, filename);
            const markdown = await accessReadFile(currPath);
            // TODO: related to blog/[slug]/page.tsx reconsider if this should be an error
            if (!markdown) {
                throw new Error(`Could not read file ${currPath}`);
            }
            const { source, frontmatter } = await processMdx<DefinitionMetadata>(markdown);

            frontmatter.url = new URL(path.join('dictionaries', frontmatter.dictionary), APP_URL).toString();
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

        return definitions2;
}
