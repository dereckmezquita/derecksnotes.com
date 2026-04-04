'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import type {
  GraphNode,
  GraphEdge,
  GraphData,
  GraphQueryOptions
} from '@derecksnotes/shared';

import ExploreControlPanel from '@/components/pages/explore/ExploreControlPanel';
import ExploreDetailPanel from '@/components/pages/explore/ExploreDetailPanel';
import ExploreSearchBar from '@/components/pages/explore/ExploreSearchBar';
import type { ExploreGraphHandle } from '@/components/pages/explore/ExploreGraph';

import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV = (process.env.NEXT_PUBLIC_BUILD_ENV as BuildEnv) || 'local';
const API_URL = ENV_CONFIG[BUILD_ENV].apiUrl;

// dynamic import -- 3d-force-graph requires window / WebGL
const ExploreGraph = dynamic(
  () => import('@/components/pages/explore/ExploreGraph'),
  { ssr: false }
) as any as React.ForwardRefExoticComponent<
  {
    nodes: GraphNode[];
    edges: GraphEdge[];
    searchTerm: string;
    onNodeClick: (node: GraphNode | null) => void;
  } & React.RefAttributes<ExploreGraphHandle>
>;

// ── styled ───────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 55;
  pointer-events: auto;
  background: #0d1117;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 60;
  background: transparent;
  color: #888;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: #4488ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const StatsBar = styled.div`
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: rgba(10, 10, 20, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 6px 16px;
  color: #666;
  font-size: 12px;
  backdrop-filter: blur(8px);
  display: flex;
  gap: 16px;
`;

// ── default query options ────────────────────────────────────────────
const DEFAULT_OPTIONS: GraphQueryOptions = {
  sections: ['blog', 'courses', 'references', 'dictionaries'],
  depth: 0,
  minEdges: 0,
  edgeTypes: ['explicit-link', 'tag-similarity', 'nlp-similarity'],
  showDictInternal: false,
  showComments: false,
  showExternal: false,
  limit: 2000
};

// ── helpers ──────────────────────────────────────────────────────────
function buildQueryString(opts: GraphQueryOptions): string {
  const params = new URLSearchParams();
  if (opts.depth != null) params.set('depth', String(opts.depth));
  if (opts.sections?.length) {
    params.set('sections', opts.sections.join(','));
  }
  if (opts.minEdges) params.set('minEdges', String(opts.minEdges));
  if (opts.edgeTypes?.length) {
    params.set('edgeTypes', opts.edgeTypes.join(','));
  }
  if (opts.showDictInternal) params.set('showDictInternal', 'true');
  if (opts.showComments) params.set('showComments', 'true');
  if (opts.showExternal) params.set('showExternal', 'true');
  if (opts.search) params.set('search', opts.search);
  if (opts.limit) params.set('limit', String(opts.limit));
  return params.toString();
}

// ── page component ───────────────────────────────────────────────────
export default function ExplorePage() {
  const graphRef = useRef<ExploreGraphHandle>(null);

  // Hide body background so the graph canvas shows through
  useEffect(() => {
    document.body.style.backgroundImage = 'none';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.overflow = '';
    };
  }, []);

  const [options, setOptions] = useState<GraphQueryOptions>(DEFAULT_OPTIONS);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // fetch graph data when options change
  const fetchGraph = useCallback(async (opts: GraphQueryOptions) => {
    try {
      setLoading(true);
      setError(null);
      const qs = buildQueryString(opts);
      const url = `${API_URL}/api/v1/graph?${qs}`;
      console.log('[Explore] Fetching graph:', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = (await res.json()) as GraphData;
      console.log(
        `[Explore] Loaded ${data.nodes.length} nodes, ${data.edges.length} edges`
      );
      setGraphData(data);
    } catch (err: any) {
      console.error('[Explore] Failed to fetch graph:', err);
      setError(err.message || 'Failed to load graph data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph(options);
  }, [options, fetchGraph]);

  // SSE for live updates
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_URL}/api/v1/graph/live`);
      es.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as Partial<GraphData>;
          setGraphData((prev) => {
            if (!prev) return prev;
            return {
              nodes: update.nodes ?? prev.nodes,
              edges: update.edges ?? prev.edges
            };
          });
        } catch {
          // ignore malformed messages
        }
      };
      es.onerror = () => {
        // silent reconnect handled by browser
      };
    } catch {
      // SSE not critical
    }
    return () => es?.close();
  }, []);

  // node / edge data (memoised to avoid unnecessary re-renders)
  const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
  const edges = useMemo(() => graphData?.edges ?? [], [graphData]);

  const handleNodeClick = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleOptionsChange = useCallback((next: GraphQueryOptions) => {
    setOptions(next);
  }, []);

  return (
    <PageWrapper>
      {/* loading state */}
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>Building graph...</LoadingText>
        </LoadingOverlay>
      )}

      {/* error state */}
      {!loading && error && (
        <LoadingOverlay>
          <LoadingText style={{ color: '#c44' }}>{error}</LoadingText>
          <LoadingText>
            The graph API may not be running. The visualisation will appear once
            data is available.
          </LoadingText>
        </LoadingOverlay>
      )}

      {/* graph */}
      {!loading && graphData && (
        <ExploreGraph
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          searchTerm={searchTerm}
          onNodeClick={handleNodeClick}
        />
      )}

      {/* controls */}
      <ExploreControlPanel options={options} onChange={handleOptionsChange} />

      {/* search */}
      <ExploreSearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* detail panel */}
      <ExploreDetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* stats bar */}
      {graphData && !loading && (
        <StatsBar>
          <span>{nodes.length} nodes</span>
          <span>{edges.length} edges</span>
        </StatsBar>
      )}
    </PageWrapper>
  );
}
