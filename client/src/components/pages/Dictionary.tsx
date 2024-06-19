'use client';

import { PageMetadata } from '@components/lib/constants';
import React, { useEffect, useState } from 'react';
import {
    Article,
    PostContainer,
    PostContentWrapper
} from './posts-dictionaries';
import { Definition } from '@components/app/dictionaries/biology/page';
import MetadataTags from '../atomic/MetadataTags';

interface DictionaryProps {
    definitions: Definition[];
    pageMetadata: PageMetadata;
}

export function Dictionary({ definitions, pageMetadata }: DictionaryProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <PostContainer>
            <MetadataTags {...pageMetadata} />
            <Article>
                <h1>Biology Dictionary</h1>
                <ol>{isClient && renderDefinitions(definitions)}</ol>
            </Article>
        </PostContainer>
    );
}

/**
 * For rendering definitions in a numbered list; separated by sections per letter
 * @param definitions An array of definitions { source: React.ReactNode; frontmatter: DefinitionMetadata; }
 */
function renderDefinitions(definitions: Definition[]) {
    let currentLetter = '';

    return definitions.map((definition, idx) => {
        const startNewLetter: boolean =
            definition.frontmatter.letter.toUpperCase() !== currentLetter;
        if (startNewLetter) {
            currentLetter = definition.frontmatter.letter.toUpperCase();
        }

        return (
            <>
                {startNewLetter && <h2 id={currentLetter}>{currentLetter}</h2>}
                <li key={definition.frontmatter.slug}>
                    <PostContentWrapper>{definition.source}</PostContentWrapper>
                </li>
            </>
        );
    });
}
