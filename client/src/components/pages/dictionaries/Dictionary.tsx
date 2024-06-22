'use client';

import { PageMetadata } from '@components/lib/constants';
import React, { useEffect } from 'react';
import { Article, PostContainer } from '../posts-dictionaries';
import MetadataTags from '../../atomic/MetadataTags';
import { renderDefinitions } from './renderDefinitions';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';
import { DictionarySidebar } from './DictionarySidebar';
import { DictionaryProvider, useDictionary } from './DictionaryContext';

interface DictionaryProps {
    dictionaryType: string;
    definitions: Definition[];
    pageMetadata: PageMetadata;
}

export function Dictionary({
    dictionaryType,
    definitions,
    pageMetadata
}: DictionaryProps) {
    return (
        <DictionaryProvider
            initialDefinitions={definitions}
            dictionaryType={dictionaryType}
        >
            <PostContainer>
                <MetadataTags {...pageMetadata} />
                <DictionarySidebar />
                <DictionaryContent />
            </PostContainer>
        </DictionaryProvider>
    );
}

function DictionaryContent() {
    const { filteredDefinitions, dictionaryType } = useDictionary();

    useEffect(() => {
        // Function to handle scrolling to the target element
        const scrollToHash = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        // Scroll on initial load
        scrollToHash();

        // Add event listener for hash changes
        window.addEventListener('hashchange', scrollToHash);

        // Cleanup
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, []);

    return (
        <Article>
            <h1>{dictionaryType} Dictionary</h1>
            <ol>{renderDefinitions(filteredDefinitions)}</ol>
        </Article>
    );
}
