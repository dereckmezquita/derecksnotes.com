'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import KnowledgeGraphCanvas from '@/components/graph/KnowledgeGraphCanvas';
import type { GraphQueryOptions } from '@derecksnotes/shared';

const Wrapper = styled.div`
  margin: 24px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 3 / 4;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.container.border.colour.primary()};
  border-radius: 6px;
  box-shadow: ${(props) => props.theme.container.shadow.primary};
  background-color: ${(props) =>
    props.theme.container.background.colour.content()};
`;

const FullScreenLink = styled(Link)`
  display: inline-block;
  margin-top: 8px;
  font-size: 0.85rem;
  font-style: italic;
  color: ${(props) => props.theme.text.colour.anchor};
  text-decoration: none;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.text.colour.anchor_hover};
    text-decoration: underline;
  }
`;

const EMBED_OPTIONS: GraphQueryOptions = {
  sections: [
    'blog',
    'courses',
    'references',
    'dictionary-biology',
    'dictionary-chemistry',
    'dictionary-mathematics'
  ],
  depth: 0,
  minEdges: 2,
  edgeTypes: ['explicit-link', 'tag-similarity', 'nlp-similarity'],
  showDictInternal: false,
  showComments: false,
  showExternal: false,
  limit: 300
};

const EMBED_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0
};

const KnowledgeGraphEmbed: React.FC = () => {
  return (
    <Wrapper>
      <Frame>
        <KnowledgeGraphCanvas
          options={EMBED_OPTIONS}
          topBoundary={0}
          pauseWhenOffscreen={true}
          enableLiveUpdates={false}
          containerStyle={EMBED_CONTAINER_STYLE}
        />
      </Frame>
      <FullScreenLink href="/explore" scroll={false}>
        View full screen &rarr;
      </FullScreenLink>
    </Wrapper>
  );
};

export default KnowledgeGraphEmbed;
