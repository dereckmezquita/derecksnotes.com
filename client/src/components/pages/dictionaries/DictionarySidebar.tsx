'use client';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import {
  SideBarContainer,
  SideBarSiteName,
  SideBarAbout
} from '@/components/pages/posts-dictionaries';
import { ALPHABET } from '@/lib/constants';
import { TagFilter } from '@/components/ui/TagFilter';
import { useDictionary } from './DictionaryContext';
import { Definition } from '@/utils/dictionaries/fetchDefinitionMetadata';

const ExploreLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 10px 0;
  margin-bottom: 15px;
  font-size: 16px;
  text-decoration: none;
  color: ${(props) => props.theme.text.colour.anchor()};
  border-bottom: 1px dashed
    ${(props) => props.theme.container.border.colour.primary()};

  &:hover {
    text-decoration: underline;
  }
`;

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
      <ExploreLink href="/explore">Explore</ExploreLink>
      <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
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
