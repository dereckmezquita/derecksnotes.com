import path from 'path';

import { stripMdx } from '../mdx/fetchPostsMetadata';

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
}

export function extractSingleDefinitionMetadata(
    filePath: string
): DefinitionMetadata {
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
            linkedFrom: frontmatter.linkedFrom
        };
    } catch (error: any) {
        console.error(`Error reading file: ${filePath}`, error);
        console.error(error);
        process.exit(1);
    }
}
