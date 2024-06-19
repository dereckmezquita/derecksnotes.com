import fs from 'fs';
import path from 'path';

import { stripMdx } from '../mdx/fetchPostsMetadata';
import { ROOT_DIR_APP } from '@components/lib/constants';
import { DefinitionMetadata } from '@components/app/dictionaries/biology/page';

export function processSingleDefinition(filePath: string): DefinitionMetadata {
    try {
        const { summary, frontmatter } = stripMdx<DefinitionMetadata>(filePath);
        // TODO: add dates to definitions
        // const date: string = DATE_YYYY_MM_DD(frontmatter.date);

        return {
            slug: path.basename(filePath, '.mdx'),
            letter: frontmatter.letter,
            word: frontmatter.word,
            dictionary: frontmatter.dictionary,
            category: frontmatter.category,
            dataSources: frontmatter.dataSources,

            published: frontmatter.published,
            comments: frontmatter.comments,

            linksTo: frontmatter.linksTo,
            linkedFrom: frontmatter.linkedFrom,

            url: ''
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filePath}`, error);
        console.error(error);
        process.exit(1);
    }
}

export function fetchDefinitionsMetadata(folder: string): DefinitionMetadata[] {
    const files: string[] = fs.readdirSync(folder);
    const mdx: string[] = files.filter((file) => file.endsWith('.mdx'));

    let defs: DefinitionMetadata[] = mdx.map((file) => {
        return processSingleDefinition(path.join(folder, file));
    });

    defs = defs.filter((def) => def.published);

    // sort by letter; letters can be a-z and symbols/not letters should come last
    // sort by letter; letters can be a-z and symbols/not letters should come last
    return defs.sort((a, b) => {
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

export function getDefinitionsWithDictionary(
    dictionary: string
): DefinitionMetadata[] {
    const defs: DefinitionMetadata[] = fetchDefinitionsMetadata(
        path.join(ROOT_DIR_APP, 'dictionaries', dictionary, 'definitions')
    );

    return defs.map((def) => ({
        ...def,
        dictionary
    }));
}
