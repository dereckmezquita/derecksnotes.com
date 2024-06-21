'use client';

import { PageMetadata } from '@components/lib/constants';
import React, { useEffect, useState } from 'react';
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

export function Dictionary({ dictionaryType, definitions, pageMetadata }: DictionaryProps) {
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
    const [isClient, setIsClient] = useState(false);
    const { filteredDefinitions, dictionaryType } = useDictionary();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Article>
            <h1>{dictionaryType} Dictionary</h1>
            <ol>{isClient && renderDefinitions(filteredDefinitions)}</ol>
        </Article>
    );
}