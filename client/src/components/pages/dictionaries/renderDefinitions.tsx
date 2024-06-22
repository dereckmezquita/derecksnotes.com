import React from 'react';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';
import { PostContentWrapper } from '../posts-dictionaries';

/**
 * For rendering definitions in a numbered list; separated by sections per letter
 * @param definitions An array of definitions { source: React.ReactNode; frontmatter: DefinitionMetadata; }
 */
export function renderDefinitions(definitions: Definition[]) {
    let currentLetter = '';

    return definitions.map((definition, idx) => {
        const startNewLetter: boolean =
            definition.frontmatter.letter.toUpperCase() !== currentLetter;
        if (startNewLetter) {
            currentLetter = definition.frontmatter.letter.toUpperCase();
        }

        return (
            <React.Fragment key={definition.frontmatter.slug}>
                {startNewLetter && (
                    <h2 id={currentLetter} style={{ scrollMarginTop: '100px' }}>
                        {currentLetter}
                    </h2>
                )}
                <li id={definition.frontmatter.slug} style={{ scrollMarginTop: '100px' }}>
                    <PostContentWrapper>{definition.source}</PostContentWrapper>
                </li>
            </React.Fragment>
        );
    });
}