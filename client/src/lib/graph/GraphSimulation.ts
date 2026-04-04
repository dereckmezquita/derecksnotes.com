import { Vec2 } from '@/lib/physics/Vec2';
import { Particle } from '@/lib/physics/Particle';
import { QuadTree } from '@/lib/physics/QuadTree';
import { SpatialHash } from '@/lib/physics/SpatialHash';
import type { GraphNode, GraphEdge } from '@derecksnotes/shared/graph';

function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax,
    dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const closestX = ax + t * dx;
  const closestY = ay + t * dy;
  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
}

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
  bondStrength: number;
  damping: number;
  wind: number;
  gravity: number;
}

const BASE_RADIUS = 6;
const WALL_BOUNCE = 0.7;
const MAX_REPULSION_DIST = 300;
const MAX_FORCE = 50;

export class GraphSimulation {
  private nodes: SimNode[] = [];
  private edges: SimEdge[] = [];
  private nodeMap: Map<string, SimNode> = new Map();
  private quadTree: QuadTree;
  private spatialHash: SpatialHash;
  private width: number;
  private height: number;
  private frame: number = 0;
  private nextParticleId: number = 0;
  private draggedNodeId: string | null = null;
  private lastDragPos: { x: number; y: number } | null = null;

  private params: PhysicsParams = {
    repulsionStrength: 1.0,
    bondStrength: 0.08,
    damping: 0.92,
    wind: 0.015,
    gravity: 0
  };

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.quadTree = new QuadTree({ x: 0, y: 0, w: width, h: height });
    this.spatialHash = new SpatialHash(width, height, 80);
  }

  setData(apiNodes: GraphNode[], apiEdges: GraphEdge[]): void {
    this.nodes = [];
    this.edges = [];
    this.nodeMap.clear();
    this.nextParticleId = 0;
    this.frame = 0;

    // Count degree for each node
    const degreeMap = new Map<string, number>();
    for (const e of apiEdges) {
      const src = (e as any).sourceId ?? e.source;
      const tgt = (e as any).targetId ?? e.target;
      degreeMap.set(src, (degreeMap.get(src) || 0) + 1);
      degreeMap.set(tgt, (degreeMap.get(tgt) || 0) + 1);
    }

    const n = apiNodes.length;

    // Create SimNodes arranged in a circle centered on canvas
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
      // Boost mass for stronger gravity wells (affects grid distortion visualization)
      particle.mass = radius * radius * 4;

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
    }

    // Create SimEdges with rest lengths based on node radii
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
        restLength: src.particle.radius + tgt.particle.radius + 15
      });
    }

    console.log(
      `[GraphSim] setData: ${this.nodes.length} nodes, ${this.edges.length} edges created from ${apiEdges.length} API edges`
    );
  }

  step(): void {
    const nodeCount = this.nodes.length;
    if (nodeCount === 0) return;

    const { repulsionStrength, bondStrength, damping, wind, gravity } =
      this.params;

    // ── Phase 1: Build QuadTree ─────────────────────────────────────
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      w: this.width,
      h: this.height
    });
    this.spatialHash = new SpatialHash(this.width, this.height, 80);
    for (let i = 0; i < nodeCount; i++) {
      this.quadTree.insert(this.nodes[i].particle);
      this.spatialHash.insert(this.nodes[i].particle);
    }

    // ── Phase 2: Coulomb repulsion via QuadTree ─────────────────────
    const queryCenter = new Vec2(0, 0);
    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];
      if (node.id === this.draggedNodeId) continue;

      const pi = node.particle;
      queryCenter.x = pi.pos.x;
      queryCenter.y = pi.pos.y;
      const nearby = this.quadTree.queryRadius(queryCenter, MAX_REPULSION_DIST);

      for (let j = 0; j < nearby.length; j++) {
        const pj = nearby[j];
        if (pj.id === pi.id) continue;

        const dx = pi.pos.x - pj.pos.x;
        const dy = pi.pos.y - pj.pos.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 0.01) continue;

        const dist = Math.sqrt(distSq);

        // Coulomb: F = repulsionStrength * m1 * m2 / r^2
        let force = (repulsionStrength * pi.mass * pj.mass) / distSq;
        if (force > MAX_FORCE) force = MAX_FORCE;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        // Apply only to pi (pj will get its turn in the outer loop)
        pi.applyForceXY(fx, fy);
      }
    }

    // ── Phase 3: Spring bonds (Hooke's law) ─────────────────────────
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      const sp = edge.source.particle;
      const tp = edge.target.particle;

      const dx = tp.pos.x - sp.pos.x;
      const dy = tp.pos.y - sp.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;

      // Hooke's law: F = -k * (distance - restLength)
      const displacement = dist - edge.restLength;
      let strengthMul = 1;
      if (
        edge.source.id === this.draggedNodeId ||
        edge.target.id === this.draggedNodeId
      ) {
        strengthMul = 5; // stronger pull when dragging
      }
      const force = bondStrength * strengthMul * displacement;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      // Apply spring force to both particles (with damping on relative velocity)
      if (edge.source.id !== this.draggedNodeId) {
        sp.applyForceXY(fx, fy);
      }
      if (edge.target.id !== this.draggedNodeId) {
        tp.applyForceXY(-fx, -fy);
      }
    }

    // ── Phase 4: Wind (sinusoidal perturbation) ─────────────────────
    if (wind > 0) {
      for (let i = 0; i < nodeCount; i++) {
        const node = this.nodes[i];
        if (node.id === this.draggedNodeId) continue;

        const p = node.particle;
        const wx =
          Math.sin(this.frame * 0.01 + p.pos.y * 0.005) * wind * p.mass;
        const wy =
          Math.cos(this.frame * 0.007 + p.pos.x * 0.005) * wind * p.mass * 0.7;
        p.applyForceXY(wx, wy);
      }
    }

    // ── Phase 5: Gravity (downward force) ───────────────────────────
    if (gravity > 0) {
      for (let i = 0; i < nodeCount; i++) {
        const node = this.nodes[i];
        if (node.id === this.draggedNodeId) continue;
        node.particle.applyForceXY(0, gravity * node.particle.mass);
      }
    }

    // ── Phase 6: Velocity damping ───────────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];
      if (node.id === this.draggedNodeId) continue;
      node.particle.vel.x *= damping;
      node.particle.vel.y *= damping;
    }

    // ── Phase 7: Update positions ───────────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];
      if (node.id === this.draggedNodeId) continue;
      node.particle.update();
    }

    // ── Phase 8: Wall bouncing ──────────────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      this.nodes[i].particle.bounceWalls(this.width, this.height, WALL_BOUNCE);
    }

    // ── Phase 9: Prevent merging (reset age each frame) ─────────────
    for (let i = 0; i < nodeCount; i++) {
      this.nodes[i].particle.age = 0;
    }

    this.frame++;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
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

  getSpatialHash(): SpatialHash {
    return this.spatialHash;
  }

  edgeAt(x: number, y: number): SimEdge | null {
    let closest: SimEdge | null = null;
    let closestDist = 6; // max distance in px

    for (const edge of this.edges) {
      const dist = pointToSegmentDistance(
        x,
        y,
        edge.source.particle.pos.x,
        edge.source.particle.pos.y,
        edge.target.particle.pos.x,
        edge.target.particle.pos.y
      );
      if (dist < closestDist) {
        closestDist = dist;
        closest = edge;
      }
    }
    return closest;
  }

  getParticles(): Particle[] {
    return this.nodes.map((n) => n.particle);
  }

  setParam(name: keyof PhysicsParams, value: number): void {
    if (name in this.params) {
      this.params[name] = value;
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
      this.lastDragPos = { x: node.particle.pos.x, y: node.particle.pos.y };
      node.particle.pos.x = x;
      node.particle.pos.y = y;
      node.particle.vel.x = 0;
      node.particle.vel.y = 0;
    }
  }

  releaseNode(nodeId: string): void {
    if (this.draggedNodeId === nodeId) {
      const node = this.nodeMap.get(nodeId);
      if (node && this.lastDragPos) {
        // Give throw momentum based on recent drag delta
        node.particle.vel.x = (node.particle.pos.x - this.lastDragPos.x) * 0.3;
        node.particle.vel.y = (node.particle.pos.y - this.lastDragPos.y) * 0.3;
      }
      this.draggedNodeId = null;
      this.lastDragPos = null;
    }
  }
}
