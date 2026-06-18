'use client';
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react';
import styled from 'styled-components';
import type { GraphData, GraphQueryOptions } from '@derecksnotes/shared';

import { GraphSimulation, GraphRenderer } from '@/lib/graph';
import type { SimNode, SimEdge } from '@/lib/graph';
import type { SearchMode } from '@/lib/graph/GraphRenderer';

import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV = (process.env.BUILD_ENV as BuildEnv) || 'local';
const API_URL = ENV_CONFIG[BUILD_ENV].apiUrl;

// ── default query options ────────────────────────────────────────────
export const DEFAULT_GRAPH_OPTIONS: GraphQueryOptions = {
  sections: ['blog', 'courses', 'references'],
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

// ── styled ───────────────────────────────────────────────────────────
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const OverlayWrap = styled.div`
  position: absolute;
  inset: 0;
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
  animation: kg-spin 1s linear infinite;

  @keyframes kg-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 14px;
  letter-spacing: 0.5px;
`;

// ── public imperative handle ─────────────────────────────────────────
export interface KnowledgeGraphCanvasHandle {
  getSimulation: () => GraphSimulation | null;
  getRenderer: () => GraphRenderer | null;
  refetch: () => void;
}

// ── props ────────────────────────────────────────────────────────────
export interface KnowledgeGraphCanvasProps {
  /** Override query params used to fetch the graph. */
  options?: GraphQueryOptions;
  /** Pixel offset below which nodes are constrained (e.g. navbar height). */
  topBoundary?: number;
  /** Styles applied to the outer container (set to position:fixed/inset:0 for fullscreen). */
  containerStyle?: React.CSSProperties;
  /** When true, the rAF loop pauses while the container is offscreen. */
  pauseWhenOffscreen?: boolean;
  /** When true, subscribe to SSE /v1/graph/live updates. */
  enableLiveUpdates?: boolean;
  /** When true, show the loading/error overlays. */
  showLoadingOverlay?: boolean;
  /** Whether to draw the spatial-index overlay. */
  showGrid?: boolean;
  /** Whether to render the spatial-hash variant. */
  useSpatialHash?: boolean;
  /** Active search mode (forwarded to renderer). */
  searchMode?: SearchMode;
  /** Live set of node-ids that match the current title-search. */
  titleMatches?: Set<string> | null;
  /** Live set of node-ids that match the current content-search. */
  contentMatches?: Set<string> | null;
  /** Called when fetch fails. */
  onLoadError?: (msg: string) => void;
  /** Called after a successful fetch. */
  onLoaded?: (stats: { nodes: number; edges: number }) => void;
  /** Called when graph data is received (raw, post-fetch and per-SSE-update). */
  onGraphData?: (data: GraphData) => void;
  /** Called when hover state changes. */
  onNodeHover?: (node: SimNode | null) => void;
  /** Called when a node is clicked/pinned (toggle). */
  onNodeSelect?: (node: SimNode | null) => void;
}

// ── component ────────────────────────────────────────────────────────
const KnowledgeGraphCanvas = forwardRef<
  KnowledgeGraphCanvasHandle,
  KnowledgeGraphCanvasProps
>(function KnowledgeGraphCanvas(
  {
    options = DEFAULT_GRAPH_OPTIONS,
    topBoundary = 0,
    containerStyle,
    pauseWhenOffscreen = false,
    enableLiveUpdates = false,
    showLoadingOverlay = true,
    showGrid = true,
    useSpatialHash = false,
    searchMode = 'highlight',
    titleMatches = null,
    contentMatches = null,
    onLoadError,
    onLoaded,
    onGraphData,
    onNodeHover,
    onNodeSelect
  },
  ref
) {
  // ── refs (canvas + sim) ────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<GraphSimulation | null>(null);
  const rendererRef = useRef<GraphRenderer | null>(null);

  // ── refs (interaction state) ───────────────────────────────────────
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const hoveredEdgeRef = useRef<SimEdge | null>(null);
  const selectedNodeRef = useRef<SimNode | null>(null);
  const draggedNodeRef = useRef<string | null>(null);
  const panRef = useRef({ ox: 0, oy: 0, startX: 0, startY: 0, panning: false });

  // ── refs (props mirrored into render loop) ─────────────────────────
  const showGridRef = useRef(showGrid);
  const useSpatialHashRef = useRef(useSpatialHash);
  const searchModeRef = useRef<SearchMode>(searchMode);
  const titleMatchRef = useRef<Set<string> | null>(titleMatches);
  const contentMatchRef = useRef<Set<string> | null>(contentMatches);
  const topBoundaryRef = useRef(topBoundary);
  const graphDataRef = useRef<GraphData | null>(null);
  const pausedRef = useRef(false);

  // Callback refs so the rAF loop always sees the latest closure.
  const onNodeHoverRef = useRef(onNodeHover);
  const onNodeSelectRef = useRef(onNodeSelect);

  useEffect(() => {
    showGridRef.current = showGrid;
  }, [showGrid]);
  useEffect(() => {
    useSpatialHashRef.current = useSpatialHash;
  }, [useSpatialHash]);
  useEffect(() => {
    searchModeRef.current = searchMode;
  }, [searchMode]);
  useEffect(() => {
    titleMatchRef.current = titleMatches ?? null;
  }, [titleMatches]);
  useEffect(() => {
    contentMatchRef.current = contentMatches ?? null;
  }, [contentMatches]);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);
  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);
  useEffect(() => {
    topBoundaryRef.current = topBoundary;
    if (simRef.current) simRef.current.topBoundary = topBoundary;
  }, [topBoundary]);

  // ── state (data fetching + UI) ─────────────────────────────────────
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    graphDataRef.current = graphData;
  }, [graphData]);

  // Stabilise options identity for the fetch effect: serialise to a string.
  // (Parent may pass a fresh object every render but want stable behaviour.)
  const optionsKey = JSON.stringify(options);

  // ── fetch graph ────────────────────────────────────────────────────
  const fetchGraph = useCallback(
    async (opts: GraphQueryOptions) => {
      try {
        setLoading(true);
        setError(null);
        const qs = buildQueryString(opts);
        const url = `${API_URL}/v1/graph?${qs}`;
        console.log('[KnowledgeGraphCanvas] Fetching graph:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = (await res.json()) as GraphData;
        console.log(
          `[KnowledgeGraphCanvas] Loaded ${data.nodes.length} nodes, ${data.edges.length} edges`
        );
        setGraphData(data);
        onLoaded?.({ nodes: data.nodes.length, edges: data.edges.length });
        onGraphData?.(data);
      } catch (err: any) {
        const msg = err?.message || 'Failed to load graph data';
        console.error('[KnowledgeGraphCanvas] Failed to fetch graph:', err);
        setError(msg);
        onLoadError?.(msg);
      } finally {
        setLoading(false);
      }
    },
    [onLoaded, onGraphData, onLoadError]
  );

  useEffect(() => {
    fetchGraph(options);
    // optionsKey + reloadKey drive refetch; options is passed by reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, reloadKey, fetchGraph]);

  // ── SSE (gated by enableLiveUpdates) ───────────────────────────────
  useEffect(() => {
    if (!enableLiveUpdates) return;
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_URL}/v1/graph/live`);
      es.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as Partial<GraphData>;
          setGraphData((prev) => {
            if (!prev) return prev;
            const next = {
              nodes: update.nodes ?? prev.nodes,
              edges: update.edges ?? prev.edges
            };
            onGraphData?.(next);
            return next;
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
  }, [enableLiveUpdates, onGraphData]);

  // Feed data into simulation when graphData changes
  useEffect(() => {
    if (!graphData || !simRef.current) return;
    simRef.current.setData(graphData.nodes, graphData.edges);
  }, [graphData]);

  // ── Imperative handle ──────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      getSimulation: () => simRef.current,
      getRenderer: () => rendererRef.current,
      refetch: () => setReloadKey((k) => k + 1)
    }),
    []
  );

  // ── Main WebGL + physics setup ─────────────────────────────────────
  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const textCanvas = textCanvasRef.current;
    const container = containerRef.current;
    if (!glCanvas || !textCanvas || !container) {
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
      console.error('[KnowledgeGraphCanvas] WebGL init failed:', err);
      return;
    }

    // Initial size pulled from container bounding rect.
    const initialRect = container.getBoundingClientRect();
    const initialW = Math.max(1, Math.floor(initialRect.width));
    const initialH = Math.max(1, Math.floor(initialRect.height));

    const sim = new GraphSimulation(initialW, initialH);
    sim.topBoundary = topBoundaryRef.current;
    simRef.current = sim;

    // If graphData is already loaded, feed it in.
    if (graphDataRef.current) {
      sim.setData(graphDataRef.current.nodes, graphDataRef.current.edges);
    }

    let animationId = 0;
    // Cached size that the render loop reads each frame.
    let curW = initialW;
    let curH = initialH;

    const dpr =
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    function applySize(w: number, h: number) {
      if (!glCanvas || !textCanvas) return;
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
      curW = w;
      curH = h;
    }

    applySize(initialW, initialH);

    // ── ResizeObserver: drive canvas size from container dimensions ──
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = Math.max(1, Math.floor(cr.width));
        const h = Math.max(1, Math.floor(cr.height));
        if (w !== curW || h !== curH) {
          applySize(w, h);
        }
      }
    });
    ro.observe(container);

    // ── IntersectionObserver: pause when offscreen (optional) ────────
    let io: IntersectionObserver | null = null;
    if (pauseWhenOffscreen && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const visible = entry.isIntersecting && entry.intersectionRatio > 0;
            if (visible && pausedRef.current) {
              pausedRef.current = false;
              lastTime = performance.now();
              accumulator = 0;
              animationId = requestAnimationFrame(draw);
            } else if (!visible && !pausedRef.current) {
              pausedRef.current = true;
              cancelAnimationFrame(animationId);
            }
          }
        },
        { threshold: 0 }
      );
      io.observe(container);
    }

    // ── Container offset helper for mouse coords ─────────────────────
    function pointerToCanvasCoords(e: MouseEvent): { x: number; y: number } {
      const rect = glCanvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    // ── Mouse interaction ────────────────────────────────────────────
    let mouseDownPos = { x: 0, y: 0 };
    let mouseDownTime = 0;
    let hasDragged = false;

    function onMouseMove(e: MouseEvent) {
      const { x, y } = pointerToCanvasCoords(e);
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
      const prev = hoveredNodeRef.current;
      hoveredNodeRef.current = node;
      if ((prev?.id ?? null) !== (node?.id ?? null)) {
        onNodeHoverRef.current?.(node);
      }

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
      const { x, y } = pointerToCanvasCoords(e);
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
      const { x, y } = pointerToCanvasCoords(e);
      const elapsed = performance.now() - mouseDownTime;
      const dist = Math.sqrt(
        (x - mouseDownPos.x) ** 2 + (y - mouseDownPos.y) ** 2
      );

      // Release dragged node
      if (draggedNodeRef.current) {
        sim.releaseNode(draggedNodeRef.current);

        // If it was a click (short + no drag), toggle pin on the node
        if (elapsed < 300 && dist < 5) {
          const node = sim.nodeAt(x, y);
          if (node) {
            // Toggle: click same node again to deselect
            const next = selectedNodeRef.current?.id === node.id ? null : node;
            selectedNodeRef.current = next;
            onNodeSelectRef.current?.(next);
          }
        }
        draggedNodeRef.current = null;
      } else if (panRef.current.panning) {
        panRef.current.panning = false;

        // If it was a click on empty space, deselect
        if (elapsed < 300 && dist < 5) {
          selectedNodeRef.current = null;
          onNodeSelectRef.current?.(null);
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

    // ── Render loop ─────────────────────────────────────────────────
    // Fixed timestep physics at 60Hz
    const PHYSICS_DT = 1000 / 60;
    let lastTime = performance.now();
    let accumulator = 0;

    function draw() {
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
          curW,
          curH,
          hoveredNodeRef.current,
          selectedNodeRef.current,
          hoveredEdgeRef.current,
          mouseRef.current.x,
          mouseRef.current.y,
          showGridRef.current,
          useSpatialHashRef.current,
          titleMatchRef.current,
          contentMatchRef.current,
          searchModeRef.current
        );
      } catch (err) {
        console.error('[KnowledgeGraphCanvas] draw() error:', err);
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
      io?.disconnect();
      glCanvas.removeEventListener('mousemove', onMouseMove);
      glCanvas.removeEventListener('mousedown', onMouseDown);
      glCanvas.removeEventListener('mouseup', onMouseUp);
      glCanvas.removeEventListener('mouseleave', onMouseLeave);
      simRef.current = null;
      rendererRef.current = null;
    };
    // Setup runs once per mount. graphData feeds in via a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseWhenOffscreen]);

  // ── render ─────────────────────────────────────────────────────────
  const mergedStyle: React.CSSProperties = {
    // Default to filling parent; parent can override via containerStyle.
    width: '100%',
    height: '100%',
    ...containerStyle
  };

  return (
    <Container ref={containerRef} style={mergedStyle}>
      {/* WebGL canvas */}
      <canvas
        ref={glCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          zIndex: 50
        }}
      />

      {/* Text overlay canvas (Canvas2D for labels) */}
      <canvas
        ref={textCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 51
        }}
      />

      {/* Loading state */}
      {showLoadingOverlay && loading && (
        <OverlayWrap>
          <Spinner />
          <LoadingText>Building graph...</LoadingText>
        </OverlayWrap>
      )}

      {/* Error state */}
      {showLoadingOverlay && !loading && error && (
        <OverlayWrap>
          <LoadingText style={{ color: '#c44' }}>{error}</LoadingText>
          <LoadingText>
            The graph API may not be running. The visualisation will appear once
            data is available.
          </LoadingText>
        </OverlayWrap>
      )}
    </Container>
  );
});

export default KnowledgeGraphCanvas;
