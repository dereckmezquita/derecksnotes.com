'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { GraphQueryOptions } from '@derecksnotes/shared';

import type { SearchMode } from '@/lib/graph/GraphRenderer';
import ExploreControlPanel, {
  type PhysicsControlKey
} from '@/components/pages/explore/ExploreControlPanel';
import { useSearch } from '@/hooks/useSearch';
import KnowledgeGraphCanvas, {
  DEFAULT_GRAPH_OPTIONS,
  type KnowledgeGraphCanvasHandle
} from '@/components/graph/KnowledgeGraphCanvas';

// ── canvas top offset (below navbar) ─────────────────────────────────
const CANVAS_TOP = 200;

// ── page component ───────────────────────────────────────────────────
export default function ExplorePage() {
  const canvasRef = useRef<KnowledgeGraphCanvasHandle>(null);

  const [options, setOptions] = useState<GraphQueryOptions>(
    DEFAULT_GRAPH_OPTIONS
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('highlight');
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [useSpatialHash, setUseSpatialHash] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Title/content match sets feed the canvas renderer (via props).
  // Stored as state so React drives the prop updates; the canvas mirrors
  // them to refs internally for the render loop to read each frame.
  const [titleMatches, setTitleMatches] = useState<Set<string> | null>(null);
  const [contentMatches, setContentMatches] = useState<Set<string> | null>(
    null
  );

  // Content search via server API (debounced)
  const { search: searchContent, results: contentResults } = useSearch();

  // Handle search term changes: client-side title match + trigger server content search
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      // Client-side: instant title/section/tag matching
      const sim = canvasRef.current?.getSimulation();
      if (term.length >= 2 && sim) {
        const needle = term.toLowerCase();
        const titleSet = new Set<string>();
        for (const node of sim.getNodes()) {
          const haystack = (
            node.title +
            ' ' +
            node.section +
            ' ' +
            (node.tags?.join(' ') ?? '')
          ).toLowerCase();
          if (haystack.includes(needle)) {
            titleSet.add(node.id);
          }
        }
        setTitleMatches(titleSet);
      } else {
        setTitleMatches(null);
        setContentMatches(null);
      }

      // Server-side: debounced full-text content search
      searchContent(term);
    },
    [searchContent]
  );

  // When content search results arrive, cross-reference with graph nodes by path
  useEffect(() => {
    const sim = canvasRef.current?.getSimulation();
    if (contentResults.length === 0 || !sim) {
      setContentMatches(null);
      return;
    }
    const resultPaths = new Set(contentResults.map((r) => r.path));
    const contentSet = new Set<string>();
    for (const node of sim.getNodes()) {
      // Graph paths may have hash fragments (#section), search paths don't
      const basePath = node.path.split('#')[0];
      if (resultPaths.has(basePath) || resultPaths.has(node.path)) {
        contentSet.add(node.id);
      }
    }
    setContentMatches(contentSet.size > 0 ? contentSet : null);
  }, [contentResults]);

  // ── Page-level side effects (NOT moved into the canvas component) ──
  // Prevent scrolling on explore page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Hide background grid
  useEffect(() => {
    document.body.style.backgroundImage = 'none';
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  // ── Physics param handler from control panel ───────────────────────
  const handlePhysicsChange = useCallback(
    (param: PhysicsControlKey, value: number) => {
      const renderer = canvasRef.current?.getRenderer();
      if (param === 'gridStrength') {
        if (renderer) renderer.gridStrength = value;
        return;
      }
      const sim = canvasRef.current?.getSimulation();
      if (!sim) return;
      sim.setParam(param, value);
    },
    []
  );

  const handleOptionsChange = useCallback((next: GraphQueryOptions) => {
    setOptions(next);
  }, []);

  const handleLoaded = useCallback(
    (stats: { nodes: number; edges: number }) => {
      setNodeCount(stats.nodes);
      setEdgeCount(stats.edges);
    },
    []
  );

  return (
    <>
      <KnowledgeGraphCanvas
        ref={canvasRef}
        options={options}
        topBoundary={CANVAS_TOP}
        enableLiveUpdates={true}
        showLoadingOverlay={true}
        showGrid={showGrid}
        useSpatialHash={useSpatialHash}
        searchMode={searchMode}
        titleMatches={titleMatches}
        contentMatches={contentMatches}
        onLoaded={handleLoaded}
        containerStyle={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 50
        }}
      />

      {/* Controls (includes search) */}
      <ExploreControlPanel
        options={options}
        onChange={handleOptionsChange}
        onPhysicsChange={handlePhysicsChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
        useSpatialHash={useSpatialHash}
        onSpatialHashToggle={setUseSpatialHash}
        showGrid={showGrid}
        onShowGridToggle={setShowGrid}
        nodeCount={nodeCount}
        edgeCount={edgeCount}
      />
    </>
  );
}
