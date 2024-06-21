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

function DictionarySidebar() {
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

    let all_tags: string[] = definitionsTagsToArr(definitions);
    all_tags = [...ALPHABET, ...all_tags];

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
        const filteredDefinitions = definitions.filter((def) => {
            if (selectedTags.length === 0) return true;
            const defTags = [
                ...def.frontmatter.linksTo,
                ...def.frontmatter.linkedFrom
            ];
            return selectedTags.some((tag) => defTags.includes(tag));
        });

        if (searchMode === 'words' && searchTerm) {
            const filteredBySearch = filteredDefinitions.filter((def) =>
                def.frontmatter.word
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
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

export default DictionarySidebar;
