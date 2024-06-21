'use client';
import React, { useEffect } from 'react';

import SearchBar from '@components/components/atomic/SearchBar';
import SelectDropDown from '@components/components/atomic/SelectDropDown';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarAbout
} from '@components/components/pages/posts-dictionaries';
import { ALPHABET } from '@components/lib/constants';
import { TagFilter } from '../../ui/TagFilter';
import { useDictionary } from './DictionaryContext';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';

/**
 * Extracts unique tags from all definitions.
 * @param definitions - Array of all dictionary definitions
 * @returns Array of unique tags sorted alphabetically
 */
function definitionsTagsToArr(definitions: Definition[]): string[] {
    const tags = Array.from(
        new Set(
            definitions.flatMap((def) => [
                ...def.frontmatter.linksTo,
                ...def.frontmatter.linkedFrom
            ])
        )
    ).sort();

    return tags.filter((tag) => tag !== '');
}

export function DictionarySidebar() {
    const {
        definitions,
        setFilteredDefinitions,
        searchMode,
        setSearchMode,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags
    } = useDictionary();

    // Combine alphabet and content tags
    let all_tags: string[] = [
        ...ALPHABET,
        ...definitionsTagsToArr(definitions)
    ];

    // Filter displayed tags based on search mode and term
    const displayedTags =
        searchMode === 'tags' && searchTerm
            ? all_tags.filter((tag) => tag.toLowerCase().includes(searchTerm))
            : all_tags;

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    useEffect(() => {
        /**
         * Main filtering logic for definitions based on selected tags and search term.
         * This complex filtering handles multiple scenarios:
         * 1. Alphabetical filtering (A-Z, #)
         * 2. Content tag filtering (linksTo, linkedFrom)
         * 3. Word search filtering
         */
        const filteredDefinitions = definitions.filter((def) => {
            // If no tags selected, include all definitions
            if (selectedTags.length === 0) return true;

            // Check if the definition matches any of the selected criteria
            return (
                // Alphabetical filtering
                selectedTags.includes(def.frontmatter.letter.toUpperCase()) ||
                // Word starts with the first selected tag (for more specific letter filtering)
                def.frontmatter.word.toLowerCase().startsWith(selectedTags[0].toLowerCase()) ||
                // Content tag filtering
                def.frontmatter.linksTo.some(tag => selectedTags.includes(tag)) ||
                def.frontmatter.linkedFrom.some(tag => selectedTags.includes(tag))
            );
        });

        // Additional word search filtering if in 'words' mode
        if (searchMode === 'words' && searchTerm) {
            const filteredBySearch = filteredDefinitions.filter((def) =>
                def.frontmatter.word.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDefinitions(filteredBySearch);
        } else {
            setFilteredDefinitions(filteredDefinitions);
        }
    }, [
        selectedTags,
        searchTerm,
        searchMode,
        definitions,
        setFilteredDefinitions
    ]);

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
                    setSearchTerm('');
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
            <SideBarAbout />
        </SideBarContainer>
    );
}
