'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import KnowledgeGraphCanvas from '@/components/graph/KnowledgeGraphCanvas';
import ExploreControlPanel from '@/components/pages/explore/ExploreControlPanel';
import type { GraphQueryOptions } from '@derecksnotes/shared';

const Outer = styled.div`
  margin: 24px auto;
  border: 1px solid ${(props) => props.theme.container.border.colour.primary()};
  border-radius: 6px;
  box-shadow: ${(props) => props.theme.container.shadow.primary};
  background-color: ${(props) =>
    props.theme.container.background.colour.content()};
  overflow: hidden;
`;

const Chin = styled.div`
  padding: 8px 14px;
  background-color: ${(props) =>
    props.theme.container.background.colour.primary()};
  font-size: 0.85rem;
  color: ${(props) => props.theme.text.colour.light_grey()};
`;

const TopChin = styled(Chin)`
  border-bottom: 1px solid
    ${(props) => props.theme.container.border.colour.primary()};
  text-align: center;
`;

const BottomChin = styled(Chin)`
  border-top: 1px solid
    ${(props) => props.theme.container.border.colour.primary()};
  padding: 0;
`;

const FullScreenLink = styled(Link)`
  font-style: italic;
  color: ${(props) => props.theme.text.colour.anchor};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.text.colour.anchor_hover};
    text-decoration: underline;
  }
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
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

const CANVAS_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0
};

const KnowledgeGraphEmbed: React.FC = () => {
  const [options, setOptions] = useState<GraphQueryOptions>(EMBED_OPTIONS);
  const [showGrid, setShowGrid] = useState(true);
  const [useSpatialHash, setUseSpatialHash] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  const handleLoaded = useCallback(
    (stats: { nodes: number; edges: number }) => {
      setNodeCount(stats.nodes);
      setEdgeCount(stats.edges);
    },
    []
  );

  return (
    <Outer>
      <TopChin>
        <FullScreenLink href="/explore" scroll={false}>
          View full screen &rarr;
        </FullScreenLink>
      </TopChin>
      <Frame>
        <KnowledgeGraphCanvas
          options={options}
          topBoundary={0}
          pauseWhenOffscreen={true}
          enableLiveUpdates={false}
          containerStyle={CANVAS_CONTAINER_STYLE}
          showGrid={showGrid}
          useSpatialHash={useSpatialHash}
          onLoaded={handleLoaded}
        />
      </Frame>
      <BottomChin>
        <ExploreControlPanel
          inline
          options={options}
          onChange={setOptions}
          useSpatialHash={useSpatialHash}
          onSpatialHashToggle={setUseSpatialHash}
          showGrid={showGrid}
          onShowGridToggle={setShowGrid}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
        />
      </BottomChin>
    </Outer>
  );
};

export default KnowledgeGraphEmbed;
