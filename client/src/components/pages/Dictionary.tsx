'use client';

import { PageMetadata } from "@components/lib/constants";
import React from "react";
import { PostContainer } from "./posts-dictionaries";
import { DefinitionMetadata } from "@components/utils/dictionaries/fetchDefinitionMetadata";

interface Definition {
    source: React.ReactNode;
    frontmatter: DefinitionMetadata;
}

interface DictionaryProps {
    definitions: Definition[];
    pageMetadata: PageMetadata;
    sideBarDefinitions: DefinitionMetadata[];
}

export function Dictionary({ definitions, pageMetadata, sideBarDefinitions }: DictionaryProps) {

    return (
        <PostContainer>

        </PostContainer>
    );
}