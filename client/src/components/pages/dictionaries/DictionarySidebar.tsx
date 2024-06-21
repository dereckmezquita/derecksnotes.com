'use client';
import React, { useState } from 'react';

import SearchBar from '@components/components/atomic/SearchBar';
import SelectDropDown from '@components/components/atomic/SelectDropDown';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarAbout
} from '@components/components/pages/posts-dictionaries';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';

import { ALPHABET } from '@components/lib/constants';
import { TagFilter } from '../../ui/TagFilter';

interface DictionarySidebarProps {
    definitions: Definition[];
}

/**
 * Get all tags from definitions as a single array
 * removing duplicates and empty strings
 * @param definitions Array of definitions
 * @returns
 */
function definitionsTagsToArr(definitions: Definition[]): string[] {
    const tags = Array.from(
        new Set(
            definitions.flatMap((def) => {
                return [
                    ...def.frontmatter.linksTo,
                    ...def.frontmatter.linkedFrom
                ];
            })
        )
    ).sort();

    return tags.filter((tag) => tag !== '');
}

function DictionarySidebar({ definitions }: DictionarySidebarProps) {
    const [searchMode, setSearchMode] = useState<'words' | 'tags'>('words');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // get all linksTo and linkedFrom in a single array
    let all_tags: string[] = definitionsTagsToArr(definitions);

    all_tags = [...ALPHABET, ...all_tags];

    // allow for search
    const displayedTags =
        searchMode === 'tags' && searchTerm
            ? all_tags.filter((tag) => tag.toLowerCase().includes(searchTerm))
            : all_tags;

    const handleTagSelect = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            <SelectDropDown
                options={[
                    { label: 'Search words', value: 'words' },
                    { label: 'Search tags', value: 'tags' }
                ]}
                value={searchMode}
                onChange={(value) => {
                    setSearchMode(value as 'words' | 'tags');
                    setSearchTerm(''); // Clear the search term when switching modes
                }}
            />
            <TagFilter
                tags={displayedTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                initialVisibility={true}
                styleContainer={{
                    backgroundColor: 'inherit',
                    boxShadow: 'none',
                    border: 'none'
                }}
            />
            <SearchBar
                value={searchTerm}
                onChange={(value: string) => setSearchTerm(value.toLowerCase())}
                placeholder={
                    searchMode === 'words'
                        ? 'Search words...'
                        : 'Search tags...'
                }
            />
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default DictionarySidebar;
