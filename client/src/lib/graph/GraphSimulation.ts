import { Vec2 } from '@/lib/physics/Vec2';
import { Particle } from '@/lib/physics/Particle';
import { QuadTree } from '@/lib/physics/QuadTree';
import type { GraphNode, GraphEdge } from '@derecksnotes/shared/graph';

export interface SimNode {
  id: string;
  particle: Particle;
  title: string;
  section: string;
  category?: string;
  nodeType: string;
  path: string;
  tags?: string[];
  metadata?: GraphNode['metadata'];
  degree: number;
}

export interface SimEdge {
  source: SimNode;
  target: SimNode;
  edgeType: string;
  weight: number;
  restLength: number;
}

interface PhysicsParams {
  repulsionStrength: number;
  attractionStrength: number;
  damping: number;
  wind: number;
  gravity: number;
  temperature: number;
}

const BASE_RADIUS = 7;
const WALL_BOUNCE = 0.7;
const COOLING_FACTOR = 0.95;
const MIN_TEMPERATURE = 0.5;

export class GraphSimulation {
  private nodes: SimNode[] = [];
  private edges: SimEdge[] = [];
  private nodeMap: Map<string, SimNode> = new Map();
  private nodeIndexMap: Map<string, number> = new Map();
  private quadTree: QuadTree;
  private width: number;
  private height: number;
  private frame: number = 0;
  private nextParticleId: number = 0;
  private draggedNodeId: string | null = null;

  // Fruchterman-Reingold state
  private k: number = 1; // optimal distance
  private initialTemperature: number;
  private settled: boolean = false;

  // Per-node displacement accumulators (avoid allocations in hot loop)
  private dispX: Float64Array = new Float64Array(0);
  private dispY: Float64Array = new Float64Array(0);

  private params: PhysicsParams = {
    repulsionStrength: 1.0,
    attractionStrength: 1.0,
    damping: 0.85,
    wind: 0.02,
    gravity: 0,
    temperature: 0
  };

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initialTemperature = width / 10;
    this.params.temperature = this.initialTemperature;
    this.quadTree = new QuadTree({ x: 0, y: 0, w: width, h: height });
  }

  setData(apiNodes: GraphNode[], apiEdges: GraphEdge[]): void {
    this.nodes = [];
    this.edges = [];
    this.nodeMap.clear();
    this.nodeIndexMap.clear();
    this.nextParticleId = 0;

    // Count degree for each node
    // Handle both property name conventions (source/target vs sourceId/targetId)
    const degreeMap = new Map<string, number>();
    for (const e of apiEdges) {
      const src = (e as any).sourceId ?? e.source;
      const tgt = (e as any).targetId ?? e.target;
      degreeMap.set(src, (degreeMap.get(src) || 0) + 1);
      degreeMap.set(tgt, (degreeMap.get(tgt) || 0) + 1);
    }

    const n = apiNodes.length;

    // Compute FR optimal distance: k = C * sqrt(area / N)
    const area = this.width * this.height;
    this.k = Math.sqrt(area / Math.max(n, 1));

    // Reset temperature for new layout
    this.initialTemperature = this.width / 10;
    this.params.temperature = this.initialTemperature;
    this.settled = false;
    this.frame = 0;

    // Create SimNodes arranged in a circle (FR paper recommendation)
    const cx = this.width / 2;
    const cy = this.height / 2;
    const circleRadius = Math.min(this.width, this.height) * 0.35;

    for (let i = 0; i < apiNodes.length; i++) {
      const apiNode = apiNodes[i];
      const degree = degreeMap.get(apiNode.id) || 0;
      const radius = BASE_RADIUS + Math.sqrt(degree) * 2;

      // Initial position: circle layout
      const angle = (2 * Math.PI * i) / n;
      const px = cx + Math.cos(angle) * circleRadius;
      const py = cy + Math.sin(angle) * circleRadius;

      const particle = new Particle({
        id: this.nextParticleId++,
        pos: new Vec2(px, py),
        vel: new Vec2(0, 0),
        radius
      });
      // Override mass to be uniform for FR (forces are position-based, not mass-based)
      particle.mass = 1;

      const simNode: SimNode = {
        id: apiNode.id,
        particle,
        title: apiNode.title,
        section: apiNode.section,
        category: apiNode.category,
        nodeType: apiNode.nodeType,
        path: apiNode.path,
        tags: apiNode.tags,
        metadata: apiNode.metadata,
        degree
      };

      this.nodes.push(simNode);
      this.nodeMap.set(apiNode.id, simNode);
      this.nodeIndexMap.set(apiNode.id, i);
    }

    // Allocate displacement arrays
    this.dispX = new Float64Array(n);
    this.dispY = new Float64Array(n);

    // Create SimEdges (handle sourceId/targetId vs source/target)
    for (const e of apiEdges) {
      const srcId = (e as any).sourceId ?? e.source;
      const tgtId = (e as any).targetId ?? e.target;
      const src = this.nodeMap.get(srcId);
      const tgt = this.nodeMap.get(tgtId);
      if (!src || !tgt || src === tgt) continue;

      this.edges.push({
        source: src,
        target: tgt,
        edgeType: e.edgeType,
        weight: e.weight,
        restLength: 0 // not used in FR; kept for interface compat
      });
    }

    console.log(
      `[GraphSim] setData: ${this.nodes.length} nodes, ${this.edges.length} edges created from ${apiEdges.length} API edges`
    );
  }

  step(): void {
    const nodeCount = this.nodes.length;
    if (nodeCount === 0) return;

    const { repulsionStrength, attractionStrength, damping, wind, gravity } =
      this.params;
    let temperature = this.params.temperature;
    const k = this.k;
    const kSq = k * k;

    // ── Phase 1: Build QuadTree ─────────────────────────────────────
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      w: this.width,
      h: this.height
    });
    for (let i = 0; i < nodeCount; i++) {
      this.quadTree.insert(this.nodes[i].particle);
    }

    // ── Phase 2: Zero displacement accumulators ─────────────────────
    this.dispX.fill(0);
    this.dispY.fill(0);

    // ── Phase 3: Repulsive forces (all pairs) ───────────────────────
    // FR repulsion: F_rep = k^2 / d  (along direction away from other)
    for (let i = 0; i < nodeCount; i++) {
      const pi = this.nodes[i].particle;
      for (let j = i + 1; j < nodeCount; j++) {
        const pj = this.nodes[j].particle;

        const dx = pi.pos.x - pj.pos.x;
        const dy = pi.pos.y - pj.pos.y;
        const distSq = dx * dx + dy * dy;

        // Avoid division by zero; use a small epsilon
        const dist = Math.sqrt(distSq) || 0.01;

        const force = (kSq * repulsionStrength) / dist;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        this.dispX[i] += fx;
        this.dispY[i] += fy;
        this.dispX[j] -= fx;
        this.dispY[j] -= fy;
      }
    }

    // ── Phase 4: Attractive forces (connected pairs only) ───────────
    // FR attraction: F_att = d^2 / k  (along direction toward other)
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      const si = this.nodeIndexMap.get(edge.source.id);
      const ti = this.nodeIndexMap.get(edge.target.id);
      if (si === undefined || ti === undefined) continue;

      const sp = edge.source.particle;
      const tp = edge.target.particle;

      const dx = sp.pos.x - tp.pos.x;
      const dy = sp.pos.y - tp.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;

      const normalizedWeight = Math.min(edge.weight, 100) / 100;
      const force =
        (dist * dist * attractionStrength * (0.5 + normalizedWeight * 0.5)) / k;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      // Attract: source moves toward target
      this.dispX[si] -= fx;
      this.dispY[si] -= fy;
      this.dispX[ti] += fx;
      this.dispY[ti] += fy;
    }

    // ── Phase 5: Gravity (toward center) ────────────────────────────
    if (gravity !== 0) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      for (let i = 0; i < nodeCount; i++) {
        const p = this.nodes[i].particle;
        const dx = cx - p.pos.x;
        const dy = cy - p.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        this.dispX[i] += (dx / dist) * gravity * dist * 0.01;
        this.dispY[i] += (dy / dist) * gravity * dist * 0.01;
      }
    }

    // ── Phase 6: Wind perturbation (after layout settles) ───────────
    if (this.settled) {
      for (let i = 0; i < nodeCount; i++) {
        const p = this.nodes[i].particle;
        this.dispX[i] +=
          Math.sin(this.frame * 0.01 + p.pos.y * 0.005) * wind * k;
        this.dispY[i] +=
          Math.cos(this.frame * 0.007 + p.pos.x * 0.005) * wind * k * 0.7;
      }
    }

    // ── Phase 7: Apply displacement (clamped by temperature) ────────
    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];
      if (node.id === this.draggedNodeId) {
        node.particle.vel.x = 0;
        node.particle.vel.y = 0;
        continue;
      }

      let dx = this.dispX[i];
      let dy = this.dispY[i];
      const dispLen = Math.sqrt(dx * dx + dy * dy) || 0.01;

      // Clamp displacement by temperature
      const clampedLen = Math.min(dispLen, temperature);
      dx = (dx / dispLen) * clampedLen;
      dy = (dy / dispLen) * clampedLen;

      // Update velocity (FR is typically position-based, but we use
      // velocity for smooth animation + damping)
      const p = node.particle;
      p.vel.x = dx * damping;
      p.vel.y = dy * damping;

      // Update position
      p.pos.x += p.vel.x;
      p.pos.y += p.vel.y;
    }

    // ── Phase 8: Wall bouncing ──────────────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      this.nodes[i].particle.bounceWalls(this.width, this.height, WALL_BOUNCE);
    }

    // ── Phase 9: Prevent particle merging ────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      this.nodes[i].particle.age = 0;
    }

    // ── Phase 10: Cool temperature ──────────────────────────────────
    if (!this.settled) {
      temperature *= COOLING_FACTOR;
      if (temperature < MIN_TEMPERATURE) {
        this.settled = true;
        temperature = MIN_TEMPERATURE;
      }
      this.params.temperature = temperature;
    }

    this.frame++;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    // Recompute k if nodes exist
    if (this.nodes.length > 0) {
      this.k = Math.sqrt((width * height) / this.nodes.length);
    }
  }

  getNodes(): SimNode[] {
    return this.nodes;
  }

  getEdges(): SimEdge[] {
    return this.edges;
  }

  getQuadTree(): QuadTree {
    return this.quadTree;
  }

  setParam(name: keyof PhysicsParams, value: number): void {
    if (name in this.params) {
      this.params[name] = value;
      // If user resets temperature, un-settle the layout
      if (name === 'temperature' && value > MIN_TEMPERATURE) {
        this.settled = false;
      }
    }
  }

  getParam(name: keyof PhysicsParams): number {
    return this.params[name];
  }

  nodeAt(x: number, y: number): SimNode | null {
    const cursor = new Vec2(x, y);
    const nearby = this.quadTree.queryRadius(cursor, 50);

    let closest: SimNode | null = null;
    let closestDist = Infinity;

    for (const p of nearby) {
      const dx = p.pos.x - x;
      const dy = p.pos.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= p.radius + 8 && dist < closestDist) {
        closestDist = dist;
        const node = this.nodes.find((n) => n.particle.id === p.id);
        if (node) closest = node;
      }
    }

    return closest;
  }

  dragNode(nodeId: string, x: number, y: number): void {
    this.draggedNodeId = nodeId;
    const node = this.nodeMap.get(nodeId);
    if (node) {
      node.particle.pos.x = x;
      node.particle.pos.y = y;
    }
  }

  releaseNode(nodeId: string): void {
    if (this.draggedNodeId === nodeId) {
      this.draggedNodeId = null;
      // Reheat slightly so graph relaxes around the dropped node
      if (this.params.temperature < 5) {
        this.params.temperature = 5;
        this.settled = false;
      }
    }
  }
}
