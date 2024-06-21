'use client';

import { PageMetadata } from '@components/lib/constants';
import React, { useEffect, useState } from 'react';
import { Article, PostContainer } from '../posts-dictionaries';
import MetadataTags from '../../atomic/MetadataTags';
import { renderDefinitions } from './renderDefinitions';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';
import DictionarySidebar from './DictionarySidebar';
import { DictionaryProvider, useDictionary } from './DictionaryContext';

interface DictionaryProps {
    definitions: Definition[];
    pageMetadata: PageMetadata;
}

function DictionaryContent() {
    const [isClient, setIsClient] = useState(false);
    const { filteredDefinitions } = useDictionary();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Article>
            <h1>Biology Dictionary</h1>
            <ol>{isClient && renderDefinitions(filteredDefinitions)}</ol>
        </Article>
    );
}

export function Dictionary({ definitions, pageMetadata }: DictionaryProps) {
    return (
        <DictionaryProvider initialDefinitions={definitions}>
            <PostContainer>
                <MetadataTags {...pageMetadata} />
                <DictionarySidebar />
                <DictionaryContent />
            </PostContainer>
        </DictionaryProvider>
    );
}