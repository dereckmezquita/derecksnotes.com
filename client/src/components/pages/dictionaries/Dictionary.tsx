'use client';

import { PageMetadata } from '@components/lib/constants';
import React, { useEffect, useState } from 'react';
import { Article, PostContainer } from '../posts-dictionaries';
import MetadataTags from '../../atomic/MetadataTags';
import { renderDefinitions } from './renderDefinitions';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';
import DictionarySidebar from './DictionarySidebar';

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
            <DictionarySidebar definitions={definitions} />
            <Article>
                <h1>Biology Dictionary</h1>
                <ol>{isClient && renderDefinitions(definitions)}</ol>
            </Article>
        </PostContainer>
    );
}
