/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
'use client';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle
} from 'react';
import dynamic from 'next/dynamic';
import type { GraphNode, GraphEdge } from '@derecksnotes/shared';
import * as THREE from 'three';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false
});

// ── colour maps ──────────────────────────────────────────────────────
const SECTION_COLOURS: Record<string, string> = {
  blog: '#2E8BC0',
  courses: '#2D9E5F',
  references: '#7E3B8F',
  'dictionary-biology': '#4CAF50',
  'dictionary-chemistry': '#3B87C5',
  'dictionary-mathematics': '#E85D75',
  comments: '#888888',
  external: '#FFA500'
};

const EDGE_COLOURS: Record<string, { colour: string; opacity: number }> = {
  'explicit-link': { colour: '#ffffff', opacity: 0.6 },
  'tag-similarity': { colour: '#4488ff', opacity: 0.3 },
  'nlp-similarity': { colour: '#888888', opacity: 0.2 },
  'dictionary-internal': { colour: '#44ff88', opacity: 0.3 },
  'external-link': { colour: '#ff8844', opacity: 0.4 },
  'comment-thread': { colour: '#888888', opacity: 0.2 }
};

// ── types ────────────────────────────────────────────────────────────
interface ForceNode extends GraphNode {
  x?: number;
  y?: number;
  z?: number;
  __degree?: number;
}

interface ForceEdge extends GraphEdge {
  source: any;
  target: any;
}

export interface ExploreGraphHandle {
  focusNode: (nodeId: string) => void;
}

interface ExploreGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchTerm: string;
  onNodeClick: (node: GraphNode | null) => void;
}

// ── helpers ──────────────────────────────────────────────────────────
function sectionColour(section: string): string {
  return SECTION_COLOURS[section] || '#aaaaaa';
}

function edgeStyle(type: string) {
  return EDGE_COLOURS[type] || { colour: '#555555', opacity: 0.2 };
}

function nodeDegree(nodeId: string, edges: GraphEdge[]): number {
  let count = 0;
  for (const e of edges) {
    if (e.source === nodeId || e.target === nodeId) count++;
  }
  return count;
}

// ── component ────────────────────────────────────────────────────────
const ExploreGraph = forwardRef<ExploreGraphHandle, ExploreGraphProps>(
  function ExploreGraph({ nodes, edges, searchTerm, onNodeClick }, ref) {
    const fgRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({
      width: 800,
      height: 600
    });

    // responsive sizing — match parent container
    useEffect(() => {
      function handleResize() {
        const parent =
          fgRef.current?.renderer?.()?.domElement?.parentElement?.parentElement;
        setDimensions({
          width: parent?.clientWidth || window.innerWidth,
          height:
            parent?.clientHeight || Math.max(window.innerHeight - 200, 500)
        });
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Configure d3 forces after graph component mounts
    useEffect(() => {
      if (!fgRef.current) return;
      const fg = fgRef.current as any;

      if (fg.d3Force) {
        fg.d3Force('charge')?.strength(-50).distanceMax(300);
        fg.d3Force('link')?.distance(25).strength(0.3);
        fg.d3Force('center')?.strength(0.15);
        console.log('[Explore] D3 forces configured');
        fg.d3ReheatSimulation?.();
      }
    }, [nodes, edges]);

    // Smooth wind effect — continuous gentle perturbation instead of jarring reheat
    const windRef = useRef<number>(0);
    useEffect(() => {
      let animId: number;
      function windTick() {
        windRef.current += 0.002;
        const fg = fgRef.current as any;
        if (fg?.graphData) {
          const nodes = fg.graphData().nodes;
          for (const node of nodes) {
            if (node.x != null) {
              node.vx =
                (node.vx || 0) +
                Math.sin(windRef.current + node.x * 0.01) * 0.03;
              node.vy =
                (node.vy || 0) +
                Math.cos(windRef.current * 0.7 + node.y * 0.01) * 0.02;
              node.vz =
                (node.vz || 0) +
                Math.sin(windRef.current * 0.5 + node.z * 0.01) * 0.02;
            }
          }
        }
        animId = requestAnimationFrame(windTick);
      }
      animId = requestAnimationFrame(windTick);
      return () => cancelAnimationFrame(animId);
    }, []);

    // degree map for node sizing
    const degreeMap = useMemo(() => {
      const m: Record<string, number> = {};
      for (const n of nodes) {
        m[n.id] = nodeDegree(n.id, edges);
      }
      return m;
    }, [nodes, edges]);

    // search match set
    const matchSet = useMemo(() => {
      if (!searchTerm.trim()) return null;
      const lower = searchTerm.toLowerCase();
      const set = new Set<string>();
      for (const n of nodes) {
        if (
          n.title.toLowerCase().includes(lower) ||
          n.section.toLowerCase().includes(lower) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(lower)))
        ) {
          set.add(n.id);
        }
      }
      return set;
    }, [nodes, searchTerm]);

    // graph data in force-graph format
    // IMPORTANT: react-force-graph expects { source, target } on links, not { sourceId, targetId }
    const graphData = useMemo(() => {
      const nodeIds = new Set(nodes.map((n) => n.id));
      const forceNodes: ForceNode[] = nodes.map((n) => ({
        ...n,
        __degree: degreeMap[n.id] || 0
      }));
      const forceEdges = edges
        .map((e) => ({
          source: (e as any).sourceId ?? (e as any).source,
          target: (e as any).targetId ?? (e as any).target,
          edgeType: e.edgeType,
          weight: e.weight
        }))
        .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
      console.log(
        `[Explore] Graph data: ${forceNodes.length} nodes, ${forceEdges.length} valid links`
      );
      return { nodes: forceNodes, links: forceEdges };
    }, [nodes, edges, degreeMap]);

    // camera fly-to
    const flyToNode = useCallback((node: ForceNode) => {
      const fg = fgRef.current;
      if (!fg || node.x == null || node.y == null || node.z == null) return;
      const distance = 120;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fg.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio
        },
        { x: node.x, y: node.y, z: node.z },
        1500
      );
    }, []);

    // imperative handle so parent can fly to a node
    useImperativeHandle(ref, () => ({
      focusNode(nodeId: string) {
        const node = graphData.nodes.find((n) => n.id === nodeId);
        if (node) flyToNode(node);
      }
    }));

    // node click handler
    const handleNodeClick = useCallback(
      (node: any) => {
        onNodeClick(node as GraphNode);
        flyToNode(node);
      },
      [onNodeClick, flyToNode]
    );

    // custom node rendering via three.js
    const nodeThreeObject = useCallback(
      (node: any) => {
        const n = node as ForceNode;
        const colour = sectionColour(n.section);
        const degree = n.__degree || 0;
        const baseSize = 2 + Math.sqrt(degree) * 1.5;

        // dimming for search
        const dimmed = matchSet !== null && !matchSet.has(n.id);
        const opacity = dimmed ? 0.12 : 1;

        let geometry: THREE.BufferGeometry;
        let size = baseSize;
        switch (n.nodeType) {
          case 'heading':
            size = baseSize * 0.5;
            geometry = new THREE.SphereGeometry(size, 12, 12);
            break;
          case 'key-term':
            size = baseSize * 0.25;
            geometry = new THREE.SphereGeometry(size, 8, 8);
            break;
          case 'comment':
            geometry = new THREE.OctahedronGeometry(size, 0);
            break;
          case 'external-link':
            geometry = new THREE.ConeGeometry(size * 0.7, size * 1.4, 8);
            break;
          default:
            geometry = new THREE.SphereGeometry(size, 16, 16);
        }

        const material = new THREE.MeshBasicMaterial({
          color: colour,
          transparent: true,
          opacity
        });
        return new THREE.Mesh(geometry, material);
      },
      [matchSet]
    );

    // edge colour
    const linkColour = useCallback((link: any) => {
      const e = link as ForceEdge;
      const style = edgeStyle(e.edgeType);
      // convert hex + opacity to rgba
      const hex = style.colour.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${style.opacity})`;
    }, []);

    // edge width based on weight
    const linkWidth = useCallback((link: any) => {
      const e = link as ForceEdge;
      return 0.3 + e.weight * 1.5;
    }, []);

    // tooltip
    const nodeLabel = useCallback((node: any) => {
      const n = node as ForceNode;
      return `<div style="background:rgba(0,0,0,0.85);color:#fff;padding:6px 10px;border-radius:4px;font-size:13px;max-width:250px;">
        <strong>${n.title}</strong>
        <br/><span style="color:${sectionColour(n.section)}">${n.section}</span>
        ${n.tags?.length ? `<br/><span style="color:#aaa">${n.tags.slice(0, 4).join(', ')}</span>` : ''}
      </div>`;
    }, []);

    if (typeof window === 'undefined') return null;

    return (
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        rendererConfig={{ alpha: true }}
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={(node: any) => sectionColour(node.section || 'blog')}
        nodeRelSize={4}
        nodeVal={(node: any) => 2 + Math.sqrt(node.__degree || 0) * 0.8}
        nodeLabel={(node: any) => node.title || node.id}
        linkColor={linkColour}
        linkWidth={(link: any) => Math.max(0.3, (link.weight || 30) / 80)}
        linkOpacity={0.4}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => onNodeClick(null)}
        enableNodeDrag={true}
        cooldownTicks={200}
        warmupTicks={0}
        d3AlphaDecay={0.03}
        d3AlphaMin={0.001}
        d3VelocityDecay={0.4}
      />
    );
  }
);

export default ExploreGraph;
