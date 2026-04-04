import { WebGLRenderer } from '@/lib/physics/WebGLRenderer';
import { GraphSimulation, SimNode, SimEdge } from './GraphSimulation';

const SECTION_COLOURS: Record<string, [number, number, number]> = {
  blog: [0.1, 0.45, 0.7],
  courses: [0.1, 0.55, 0.3],
  references: [0.45, 0.15, 0.5],
  'dictionary-biology': [0.2, 0.6, 0.2],
  'dictionary-chemistry': [0.15, 0.45, 0.7],
  'dictionary-mathematics': [0.85, 0.25, 0.35],
  comments: [0.4, 0.4, 0.4],
  external: [0.9, 0.55, 0.0]
};

const EDGE_COLOURS: Record<string, [number, number, number, number]> = {
  'explicit-link': [0.3, 0.3, 0.3, 0.5],
  'tag-similarity': [0.15, 0.3, 0.65, 0.35],
  'nlp-similarity': [0.45, 0.45, 0.45, 0.25],
  'dictionary-internal': [0.15, 0.55, 0.3, 0.4],
  'external-link': [0.65, 0.35, 0.1, 0.4],
  'comment-thread': [0.45, 0.45, 0.45, 0.3]
};

const DEFAULT_SECTION_COLOUR: [number, number, number] = [0.5, 0.5, 0.5];
const DEFAULT_EDGE_COLOUR: [number, number, number, number] = [
  0.5, 0.5, 0.5, 0.08
];

function sectionColour(section: string): [number, number, number] {
  return SECTION_COLOURS[section] || DEFAULT_SECTION_COLOUR;
}

function edgeColour(edgeType: string): [number, number, number, number] {
  return EDGE_COLOURS[edgeType] || DEFAULT_EDGE_COLOUR;
}

export class GraphRenderer {
  private renderer: WebGLRenderer;
  private textCtx: CanvasRenderingContext2D;

  constructor(gl: WebGLRenderingContext, textCtx: CanvasRenderingContext2D) {
    this.renderer = new WebGLRenderer(gl, textCtx);
    this.textCtx = textCtx;
  }

  render(
    sim: GraphSimulation,
    width: number,
    height: number,
    hoveredNode: SimNode | null,
    selectedNode: SimNode | null
  ): void {
    // 1. Clear with transparent background (let site grid show through)
    this.renderer.clear(width, height, 0, 0, 0, 0);

    const nodes = sim.getNodes();
    const edges = sim.getEdges();

    // 2. Draw spatial grid (QuadTree visualisation)
    const qt = sim.getQuadTree();
    if (qt) this.renderer.drawQuadTree(qt);

    // 3. Draw edges as thick lines
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const sp = edge.source.particle;
      const tp = edge.target.particle;
      const [r, g, b, a] = edgeColour(edge.edgeType);
      this.renderer.addThickLine(
        sp.pos.x,
        sp.pos.y,
        tp.pos.x,
        tp.pos.y,
        1.5,
        r,
        g,
        b,
        a
      );
    }

    // 4. Draw nodes — fully opaque rings
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const p = node.particle;
      const [r, g, b] = sectionColour(node.section);
      const alpha = 1.0;
      this.renderer.addCircle(p.pos.x, p.pos.y, p.radius, r, g, b, alpha);
    }

    // 5. Hovered node highlight
    if (hoveredNode) {
      const hp = hoveredNode.particle;
      this.renderer.addCircle(
        hp.pos.x,
        hp.pos.y,
        hp.radius + 3,
        1.0,
        1.0,
        1.0,
        0.6
      );
    }

    // 6. Selected node highlight
    if (selectedNode) {
      const sp = selectedNode.particle;
      this.renderer.addCircle(
        sp.pos.x,
        sp.pos.y,
        sp.radius + 5,
        1.0,
        1.0,
        1.0,
        0.8
      );
      // Inner ring in section colour
      const [r, g, b] = sectionColour(selectedNode.section);
      this.renderer.addCircle(sp.pos.x, sp.pos.y, sp.radius + 2, r, g, b, 1.0);
    }

    // 7. Flush all WebGL batches
    this.renderer.flushTriangles(width, height);
    this.renderer.flushLines(width, height);
    this.renderer.flushCircles(width, height);

    // 8. Text labels on the overlay canvas
    this.drawTextLabels(nodes, hoveredNode, selectedNode);
  }

  private drawTextLabels(
    nodes: SimNode[],
    hoveredNode: SimNode | null,
    selectedNode: SimNode | null
  ): void {
    const ctx = this.textCtx;

    // Large nodes (high degree): show abbreviated title
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.degree <= 5) continue;
      if (node === hoveredNode || node === selectedNode) continue;

      const p = node.particle;
      const label =
        node.title.length > 16 ? node.title.slice(0, 14) + '..' : node.title;

      const [r, g, b] = sectionColour(node.section);
      ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, 0.7)`;
      ctx.fillText(label, p.pos.x, p.pos.y + p.radius + 4);
    }

    // Selected node: prominent title
    if (selectedNode) {
      const sp = selectedNode.particle;
      ctx.font = 'bold 13px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(selectedNode.title, sp.pos.x, sp.pos.y - sp.radius - 8);
    }

    // Hovered node: tooltip
    if (hoveredNode) {
      const hp = hoveredNode.particle;
      const tx = hp.pos.x + hp.radius + 12;
      const ty = hp.pos.y - 20;

      // Background
      ctx.font = '11px "IBM Plex Mono", monospace';
      const titleWidth = ctx.measureText(hoveredNode.title).width;
      const sectionText = `${hoveredNode.section} | ${hoveredNode.nodeType}`;
      const sectionWidth = ctx.measureText(sectionText).width;
      const boxWidth = Math.max(titleWidth, sectionWidth) + 16;
      const tagsText =
        hoveredNode.tags && hoveredNode.tags.length > 0
          ? hoveredNode.tags.slice(0, 4).join(', ')
          : '';
      const lineCount = tagsText ? 3 : 2;
      const boxHeight = lineCount * 16 + 12;

      ctx.fillStyle = 'rgba(20, 20, 20, 0.88)';
      this.roundRect(ctx, tx, ty, boxWidth, boxHeight, 4);
      ctx.fill();

      // Title
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 11px "IBM Plex Mono", monospace';
      ctx.fillText(hoveredNode.title, tx + 8, ty + 6);

      // Section + type
      ctx.font = '10px "IBM Plex Mono", monospace';
      const [r, g, b] = sectionColour(hoveredNode.section);
      ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, 0.9)`;
      ctx.fillText(sectionText, tx + 8, ty + 22);

      // Tags
      if (tagsText) {
        ctx.fillStyle = 'rgba(180, 180, 180, 0.7)';
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillText(tagsText, tx + 8, ty + 38);
      }
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
