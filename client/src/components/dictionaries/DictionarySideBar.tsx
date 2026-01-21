'use client';

import React from 'react';
import path from 'path';
import styled from 'styled-components';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout
} from '@components/pages/posts-dictionaries';
import { DefinitionMetadata } from '@utils/dictionaries/fetchDefinitionMetadata';

const SideBarSectionTitle = styled.h3`
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.light_grey()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    padding-bottom: ${(props) => props.theme.container.spacing.xsmall};
    border-bottom: 1px dashed
        ${(props) => props.theme.container.border.colour.primary()};
`;

interface DictionarySideBarProps {
    definitions: DefinitionMetadata[];
}

export function DictionarySideBar({ definitions }: DictionarySideBarProps) {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            {definitions.length > 0 && (
                <>
                    <SideBarSectionTitle>
                        Related Definitions
                    </SideBarSectionTitle>
                    {definitions.map((def) => (
                        <SideBarEntriesContainer key={def.slug}>
                            <SideEntryLink
                                href={path.join(
                                    '/dictionaries',
                                    def.dictionary,
                                    def.slug
                                )}
                                passHref
                            >
                                {def.word}
                            </SideEntryLink>
                        </SideBarEntriesContainer>
                    ))}
                </>
            )}
            <SideBarAbout />
        </SideBarContainer>
    );
}
