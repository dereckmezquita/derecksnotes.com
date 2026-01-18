import fs from 'fs';
import path from 'path';
import { accessReadFile } from '../accessReadFile';
import { processMdx } from '../mdx/processMdx';

import { config } from '@lib/env';
import { stripMdx } from '../mdx/extractMdxSummary';
import rehypeLinkToDefinition from '../remark-rehype/rehypeLinkToDefinition';

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
    url?: string;
    summary?: string;
}

export function extractSingleDefinitionMetadata(
    filepath: string
): DefinitionMetadata | null {
    // In local dev, gracefully handle missing files (e.g., static asset requests hitting dynamic route)
    if (!config.isProduction && !fs.existsSync(filepath)) {
        console.warn(`Definition file not found: ${filepath}`);
        return null;
    }

    try {
        const { summary, frontmatter } = stripMdx<DefinitionMetadata>(filepath);

        return {
            slug: path.basename(filepath, '.mdx'),
            letter: frontmatter.letter,
            word: frontmatter.word,
            dictionary: frontmatter.dictionary,
            category: frontmatter.category,
            dataSources: frontmatter.dataSources,
            published: frontmatter.published,
            comments: frontmatter.comments,
            linksTo: frontmatter.linksTo,
            linkedFrom: frontmatter.linkedFrom,
            summary: summary
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filepath}`, error);
        throw error;
    }
}

/**
 * Fetch only the DefinitionMetadata entries in `folder` that are *related* to `currentWord`.
 * A definition is considered "related" if the currentWord is in its linksTo or linkedFrom array.
 */
export function fetchDefintionsMetadata(
    folder: string,
    currentWord: string
): DefinitionMetadata[] {
    // 1. Read all .mdx files in the given folder
    const files: string[] = fs.readdirSync(folder);
    const mdxFiles: string[] = files.filter((file) => file.endsWith('.mdx'));

    // 2. Extract metadata from each .mdx (filter out nulls from missing files)
    let definitions: DefinitionMetadata[] = mdxFiles
        .map((file) => extractSingleDefinitionMetadata(path.join(folder, file)))
        .filter((def): def is DefinitionMetadata => def !== null);

    // 3. Filter published definitions that are *related* to the current word
    definitions = definitions.filter((def) => {
        if (!def.published) {
            return false;
        }
        // "Related" means currentWord is in def.linksTo OR def.linkedFrom
        const inLinksTo = def.linksTo?.includes(currentWord) ?? false;
        const inLinkedFrom = def.linkedFrom?.includes(currentWord) ?? false;
        return inLinksTo || inLinkedFrom;
    });

    // 4. Sort results by letter
    return definitions.sort((a, b) => {
        const letterA = a.letter.toLowerCase();
        const letterB = b.letter.toLowerCase();

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
}

function extractDictionaryFromPath(dir: string): string {
    const parts = dir.split(path.sep);
    const dictionariesIndex = parts.indexOf('dictionaries');

    if (dictionariesIndex !== -1 && dictionariesIndex + 1 < parts.length) {
        return parts[dictionariesIndex + 1];
    } else {
        throw new Error("Invalid path or 'dictionaries' not found in the path");
    }
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
                    await processMdx<DefinitionMetadata>(markdown, {
                        rehypePlugins: [
                            [
                                rehypeLinkToDefinition,
                                {
                                    slug: path.basename(filename, '.mdx'),
                                    dictionary: extractDictionaryFromPath(dir)
                                }
                            ]
                        ]
                    });

                if (!frontmatter.dictionary) {
                    throw new Error(
                        `Dictionary not specified for file: ${filename}`
                    );
                }

                frontmatter.url = new URL(
                    path.join('dictionaries', frontmatter.dictionary),
                    config.baseUrl
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
