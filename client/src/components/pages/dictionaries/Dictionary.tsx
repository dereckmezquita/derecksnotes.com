'use client';
import React, { useEffect } from 'react';
import { Article, PostContainer } from '../posts-dictionaries';
import { renderDefinitions } from './renderDefinitions';
import { Definition } from '@utils/dictionaries/fetchDefinitionMetadata';
import { DictionarySidebar } from './DictionarySidebar';
import { DictionaryProvider, useDictionary } from './DictionaryContext';

interface DictionaryProps {
    dictionaryType: string;
    definitions: Definition[];
}

export function Dictionary({ dictionaryType, definitions }: DictionaryProps) {
    return (
        <DictionaryProvider
            initialDefinitions={definitions}
            dictionaryType={dictionaryType}
        >
            <PostContainer>
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
