'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import type {
  GraphNode,
  GraphData,
  GraphQueryOptions
} from '@derecksnotes/shared';

import { GraphSimulation, GraphRenderer } from '@/lib/graph';
import type { SimNode, SimEdge } from '@/lib/graph';

import ExploreControlPanel from '@/components/pages/explore/ExploreControlPanel';
import ExploreDetailPanel from '@/components/pages/explore/ExploreDetailPanel';
import ExploreSearchBar from '@/components/pages/explore/ExploreSearchBar';

import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV = (process.env.NEXT_PUBLIC_BUILD_ENV as BuildEnv) || 'local';
const API_URL = ENV_CONFIG[BUILD_ENV].apiUrl;

// ── styled ───────────────────────────────────────────────────────────
const LoadingOverlay = styled.div`
  position: fixed;
  top: 200px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 55;
  background: transparent;
  color: #888;
  gap: 16px;
  pointer-events: none;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: #c87137;
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
  z-index: 65;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 6px 16px;
  color: #666;
  font-size: 12px;
  backdrop-filter: blur(8px);
  display: flex;
  gap: 16px;
  pointer-events: none;
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

// ── canvas top offset (below navbar) ─────────────────────────────────
const CANVAS_TOP = 200;

// ── page component ───────────────────────────────────────────────────
export default function ExplorePage() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<GraphSimulation | null>(null);
  const rendererRef = useRef<GraphRenderer | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const showGridRef = useRef(true);
  const useSpatialHashRef = useRef(false);
  const hoveredEdgeRef = useRef<SimEdge | null>(null);
  const selectedNodeRef = useRef<SimNode | null>(null);
  const draggedNodeRef = useRef<string | null>(null);
  const panRef = useRef({ ox: 0, oy: 0, startX: 0, startY: 0, panning: false });
  const searchTermRef = useRef('');
  const graphDataRef = useRef<GraphData | null>(null);

  const [options, setOptions] = useState<GraphQueryOptions>(DEFAULT_OPTIONS);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [useSpatialHash, setUseSpatialHash] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Keep refs in sync with state
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);
  useEffect(() => {
    showGridRef.current = showGrid;
  }, [showGrid]);
  useEffect(() => {
    useSpatialHashRef.current = useSpatialHash;
  }, [useSpatialHash]);

  useEffect(() => {
    graphDataRef.current = graphData;
  }, [graphData]);

  // Keep selectedNodeRef in sync with state
  useEffect(() => {
    if (selectedNode) {
      const sim = simRef.current;
      if (sim) {
        selectedNodeRef.current =
          sim.getNodes().find((n) => n.id === selectedNode.id) || null;
      }
    } else {
      selectedNodeRef.current = null;
    }
  }, [selectedNode]);

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

  // Fetch graph data when options change
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

  // Feed data into simulation when graphData changes
  useEffect(() => {
    if (!graphData || !simRef.current) return;
    simRef.current.setData(graphData.nodes, graphData.edges);
    setNodeCount(graphData.nodes.length);
    setEdgeCount(graphData.edges.length);
  }, [graphData]);

  // ── Main WebGL + physics setup ─────────────────────────────────────
  useEffect(() => {
    console.log(
      '[Explore] Setup effect running, glCanvas:',
      !!glCanvasRef.current,
      'textCanvas:',
      !!textCanvasRef.current
    );
    const glCanvas = glCanvasRef.current;
    const textCanvas = textCanvasRef.current;
    if (!glCanvas || !textCanvas) {
      return;
    }

    const gl = glCanvas.getContext('webgl', {
      antialias: true,
      alpha: false
    });
    const textCtx = textCanvas.getContext('2d');
    if (!gl || !textCtx) {
      return;
    }

    let graphRenderer: GraphRenderer;
    try {
      graphRenderer = new GraphRenderer(gl, textCtx);
      rendererRef.current = graphRenderer;
    } catch (err) {
      console.error('[Explore] WebGL init failed:', err);
      return;
    }

    const canvasH = () => window.innerHeight - CANVAS_TOP;
    const canvasW = () => window.innerWidth;

    const sim = new GraphSimulation(canvasW(), canvasH());
    simRef.current = sim;

    // If graphData is already loaded, feed it in
    if (graphData) {
      sim.setData(graphData.nodes, graphData.edges);
      setNodeCount(graphData.nodes.length);
      setEdgeCount(graphData.edges.length);
    }

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!glCanvas || !textCanvas) return;
      const w = canvasW();
      const h = canvasH();
      glCanvas.width = w * dpr;
      glCanvas.height = h * dpr;
      glCanvas.style.width = w + 'px';
      glCanvas.style.height = h + 'px';
      textCanvas.width = w * dpr;
      textCanvas.height = h * dpr;
      textCanvas.style.width = w + 'px';
      textCanvas.style.height = h + 'px';
      textCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      gl!.viewport(0, 0, glCanvas.width, glCanvas.height);
      sim.resize(w, h);
    }

    resize();
    window.addEventListener('resize', resize);

    // Fixed timestep physics at 60Hz
    const PHYSICS_DT = 1000 / 60;
    let lastTime = performance.now();
    let accumulator = 0;

    // ── Mouse interaction ─────────────────────────────────────────
    let mouseDownPos = { x: 0, y: 0 };
    let mouseDownTime = 0;
    let hasDragged = false;

    function onMouseMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY - CANVAS_TOP;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = true;

      // If dragging a node
      if (draggedNodeRef.current) {
        sim.dragNode(draggedNodeRef.current, x, y);
        hasDragged = true;
        return;
      }

      // If panning
      if (panRef.current.panning) {
        // Panning is not yet implemented — would need camera offset
        hasDragged = true;
        return;
      }

      // Hover check
      const node = sim.nodeAt(x, y);
      if (node && !hoveredNodeRef.current) {
        console.log(
          `[Explore] Hover: ${node.title} at (${x.toFixed(0)}, ${y.toFixed(0)})`
        );
      }
      hoveredNodeRef.current = node;

      // Edge hover check when no node is hovered
      if (!node) {
        hoveredEdgeRef.current = sim.edgeAt(x, y);
      } else {
        hoveredEdgeRef.current = null;
      }

      if (glCanvas) {
        glCanvas.style.cursor =
          node || hoveredEdgeRef.current ? 'pointer' : 'default';
      }
    }

    function onMouseDown(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY - CANVAS_TOP;
      mouseDownPos = { x, y };
      mouseDownTime = performance.now();
      hasDragged = false;

      const node = sim.nodeAt(x, y);
      if (node) {
        draggedNodeRef.current = node.id;
        sim.dragNode(node.id, x, y);
      } else {
        panRef.current.panning = true;
        panRef.current.startX = x;
        panRef.current.startY = y;
      }
    }

    function onMouseUp(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY - CANVAS_TOP;
      const elapsed = performance.now() - mouseDownTime;
      const dist = Math.sqrt(
        (x - mouseDownPos.x) ** 2 + (y - mouseDownPos.y) ** 2
      );

      // Release dragged node
      if (draggedNodeRef.current) {
        sim.releaseNode(draggedNodeRef.current);

        // If it was a click (short + no drag), select the node
        if (elapsed < 300 && dist < 5) {
          const node = sim.nodeAt(x, y);
          if (node) {
            // Find matching GraphNode from graphData
            const gn =
              graphDataRef.current?.nodes.find((n) => n.id === node.id) || null;
            setSelectedNode(gn);
          }
        }
        draggedNodeRef.current = null;
      } else if (panRef.current.panning) {
        panRef.current.panning = false;

        // If it was a click on empty space, deselect
        if (elapsed < 300 && dist < 5) {
          setSelectedNode(null);
        }
      }
    }

    function onMouseLeave() {
      mouseRef.current.active = false;
      hoveredNodeRef.current = null;
      if (draggedNodeRef.current) {
        sim.releaseNode(draggedNodeRef.current);
        draggedNodeRef.current = null;
      }
      panRef.current.panning = false;
    }

    glCanvas.addEventListener('mousemove', onMouseMove);
    glCanvas.addEventListener('mousedown', onMouseDown);
    glCanvas.addEventListener('mouseup', onMouseUp);
    glCanvas.addEventListener('mouseleave', onMouseLeave);

    // ── Render loop ───────────────────────────────────────────────

    function draw() {
      const w = canvasW();
      const h = canvasH();

      // Fixed timestep accumulator
      const now = performance.now();
      const elapsed = Math.min(now - lastTime, 100);
      lastTime = now;
      accumulator += elapsed;

      try {
        // Run physics at fixed 60Hz
        while (accumulator >= PHYSICS_DT) {
          accumulator -= PHYSICS_DT;
          sim.step();
        }

        // Render
        graphRenderer.render(
          sim,
          w,
          h,
          hoveredNodeRef.current,
          selectedNodeRef.current,
          hoveredEdgeRef.current,
          mouseRef.current.x,
          mouseRef.current.y,
          showGridRef.current
        );
      } catch (err) {
        console.error('[Explore] draw() error:', err);
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      glCanvas.removeEventListener('mousemove', onMouseMove);
      glCanvas.removeEventListener('mousedown', onMouseDown);
      glCanvas.removeEventListener('mouseup', onMouseUp);
      glCanvas.removeEventListener('mouseleave', onMouseLeave);
      simRef.current = null;
      rendererRef.current = null;
    };
    // We intentionally omit graphData from deps — it's handled by
    // a separate useEffect that calls sim.setData().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Physics param handler from control panel ───────────────────
  const handlePhysicsChange = useCallback((param: string, value: number) => {
    const sim = simRef.current;
    if (!sim) return;
    sim.setParam(param as any, value);
  }, []);

  const handleOptionsChange = useCallback((next: GraphQueryOptions) => {
    setOptions(next);
  }, []);

  return (
    <>
      {/* WebGL canvas */}
      <canvas
        ref={glCanvasRef}
        style={{
          position: 'fixed',
          top: CANVAS_TOP,
          left: 0,
          width: '100vw',
          height: `calc(100vh - ${CANVAS_TOP}px)`,
          pointerEvents: 'auto',
          zIndex: 50
        }}
      />

      {/* Text overlay canvas (Canvas2D for labels) */}
      <canvas
        ref={textCanvasRef}
        style={{
          position: 'fixed',
          top: CANVAS_TOP,
          left: 0,
          width: '100vw',
          height: `calc(100vh - ${CANVAS_TOP}px)`,
          pointerEvents: 'none',
          zIndex: 51
        }}
      />

      {/* Loading state */}
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>Building graph...</LoadingText>
        </LoadingOverlay>
      )}

      {/* Error state */}
      {!loading && error && (
        <LoadingOverlay>
          <LoadingText style={{ color: '#c44' }}>{error}</LoadingText>
          <LoadingText>
            The graph API may not be running. The visualisation will appear once
            data is available.
          </LoadingText>
        </LoadingOverlay>
      )}

      {/* Controls (includes search) */}
      <ExploreControlPanel
        options={options}
        onChange={handleOptionsChange}
        onPhysicsChange={handlePhysicsChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        useSpatialHash={useSpatialHash}
        onSpatialHashToggle={setUseSpatialHash}
        showGrid={showGrid}
        onShowGridToggle={setShowGrid}
      />

      {/* Detail panel */}
      <ExploreDetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* Stats bar */}
      {graphData && !loading && (
        <StatsBar>
          <span>{nodeCount} nodes</span>
          <span>{edgeCount} edges</span>
        </StatsBar>
      )}
    </>
  );
}
