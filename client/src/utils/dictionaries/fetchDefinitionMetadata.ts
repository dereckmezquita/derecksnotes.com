import fs from 'fs';
import path from 'path';
import { accessReadFile } from '../accessReadFile';
import { processMdx } from '../mdx/processMdx';

import { NEXT_PUBLIC_APP_URL } from '@components/lib/env';

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
        filePaths
            .filter((filename) => filename.endsWith('.mdx'))
            .map(async (filename) => {
                const currPath = path.join(dir, filename);
                const markdown = await accessReadFile(currPath);
                if (!markdown) {
                    throw new Error(`Could not read file ${currPath}`);
                }
                const { source, frontmatter } =
                    await processMdx<DefinitionMetadata>(markdown);

                if (!frontmatter.dictionary) {
                    throw new Error(
                        `Dictionary not specified for file: ${filename}`
                    );
                }

                frontmatter.url = new URL(
                    path.join('dictionaries', frontmatter.dictionary),
                    NEXT_PUBLIC_APP_URL
                ).toString();

                frontmatter.slug = path.basename(filename, '.mdx');

                return {
                    source,
                    frontmatter
                };
            })
    );

    // filter and sort logic remains the same
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
