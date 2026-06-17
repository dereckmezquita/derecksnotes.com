'use client';
import React, { useEffect, useMemo } from 'react';

import {
  SideBarContainer,
  SideBarSiteName,
  SideBarAbout,
  KnowledgeGraphLink
} from '@/components/pages/posts-dictionaries';
import { ALPHABET } from '@/lib/constants';
import { TagFilter } from '@/components/ui/TagFilter';
import { useDictionary } from './DictionaryContext';
import { Definition } from '@/utils/dictionaries/fetchDefinitionMetadata';

function definitionsTagsToArr(definitions: Definition[]): string[] {
  const allSlugs = new Map(
    definitions.map((def) => [
      def.frontmatter.slug,
      def.frontmatter.displayName
    ])
  );

  const tags = Array.from(
    new Set(
      definitions.flatMap((def) => {
        const relatedNames = (def.frontmatter.relatedSlugs ?? [])
          .map((slug) => allSlugs.get(slug))
          .filter((name): name is string => !!name);
        return relatedNames;
      })
    )
  ).sort();

  return tags.filter((tag) => tag !== '');
}

export function DictionarySidebar() {
  const { definitions, setFilteredDefinitions, selectedTags, setSelectedTags } =
    useDictionary();

  const all_tags: string[] = useMemo(
    () => [...ALPHABET, ...definitionsTagsToArr(definitions)],
    [definitions]
  );

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleTagDeselect = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  useEffect(() => {
    const slugToDisplayName = new Map(
      definitions.map((d) => [d.frontmatter.slug, d.frontmatter.displayName])
    );

    const filteredDefinitions = definitions.filter((def) => {
      if (selectedTags.length === 0) return true;

      const relatedNames = (def.frontmatter.relatedSlugs ?? [])
        .map((slug) => slugToDisplayName.get(slug))
        .filter((name): name is string => !!name);

      return (
        selectedTags.includes(def.frontmatter.letter.toUpperCase()) ||
        selectedTags.some((tag) =>
          def.frontmatter.displayName
            .toLowerCase()
            .startsWith(tag.toLowerCase())
        ) ||
        relatedNames.some((name) => selectedTags.includes(name)) ||
        selectedTags.includes(def.frontmatter.displayName.toLowerCase())
      );
    });

    setFilteredDefinitions(filteredDefinitions);
  }, [selectedTags, definitions, setFilteredDefinitions]);

  return (
    <SideBarContainer>
      <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
      <KnowledgeGraphLink />
      <TagFilter
        tags={all_tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagDeselect={handleTagDeselect}
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
