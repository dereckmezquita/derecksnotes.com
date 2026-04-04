import { WebGLRenderer } from '@/lib/physics/WebGLRenderer';
import { GraphSimulation, SimNode, SimEdge } from './GraphSimulation';

const SECTION_COLOURS: Record<string, [number, number, number]> = {
  blog: [0.18, 0.55, 0.75],
  courses: [0.22, 0.65, 0.35],
  references: [0.55, 0.25, 0.6],
  'dictionary-biology': [0.35, 0.7, 0.35],
  'dictionary-chemistry': [0.25, 0.5, 0.75],
  'dictionary-mathematics': [0.85, 0.3, 0.4],
  comments: [0.5, 0.5, 0.5],
  external: [0.85, 0.6, 0.15]
};

const EDGE_COLOURS: Record<string, [number, number, number, number]> = {
  'explicit-link': [0.3, 0.3, 0.3, 0.7],
  'tag-similarity': [0.25, 0.35, 0.6, 0.6],
  'nlp-similarity': [0.45, 0.45, 0.45, 0.5],
  'dictionary-internal': [0.25, 0.5, 0.35, 0.6],
  'external-link': [0.5, 0.35, 0.2, 0.6],
  'comment-thread': [0.4, 0.4, 0.4, 0.5]
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
    selectedNode: SimNode | null,
    showGrid: boolean = false
  ): void {
    // 1. Clear with transparent background (let site grid show through)
    this.renderer.clear(width, height, 0, 0, 0, 0);

    const nodes = sim.getNodes();
    const edges = sim.getEdges();

    // 2. Optionally draw spatial grid (very subtle, toggleable)
    if (showGrid) {
      const qt = sim.getQuadTree();
      if (qt) this.renderer.drawQuadTree(qt);
    }

    // 3. Draw edges
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const sp = edge.source.particle;
      const tp = edge.target.particle;
      const [er, eg, eb, ea] = edgeColour(edge.edgeType);
      this.renderer.addLine(
        sp.pos.x,
        sp.pos.y,
        tp.pos.x,
        tp.pos.y,
        er,
        eg,
        eb,
        ea
      );
    }

    // 4. Draw nodes — filled circles at full opacity
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const p = node.particle;
      const [r, g, b] = sectionColour(node.section);
      this.renderer.addCircle(p.pos.x, p.pos.y, p.radius, r, g, b, 1.0);
    }

    // 5. Selected node highlight — white outer ring + section-coloured inner ring
    if (selectedNode) {
      const sp = selectedNode.particle;
      this.renderer.addCircle(
        sp.pos.x,
        sp.pos.y,
        sp.radius + 4,
        1.0,
        1.0,
        1.0,
        0.8
      );
      const [r, g, b] = sectionColour(selectedNode.section);
      this.renderer.addCircle(sp.pos.x, sp.pos.y, sp.radius + 1, r, g, b, 1.0);
    }

    // 6. Hovered node highlight — subtle white glow ring
    if (hoveredNode && hoveredNode !== selectedNode) {
      const hp = hoveredNode.particle;
      this.renderer.addCircle(
        hp.pos.x,
        hp.pos.y,
        hp.radius + 3,
        1.0,
        1.0,
        1.0,
        0.5
      );
    }

    // 7. Flush all WebGL batches
    this.renderer.flushTriangles(width, height);
    this.renderer.flushLines(width, height);
    this.renderer.flushCircles(width, height);

    // 8. Text labels on the overlay canvas (hover tooltip only)
    this.drawTextLabels(nodes, edges, hoveredNode, selectedNode, width, height);
  }

  private drawTextLabels(
    nodes: SimNode[],
    edges: SimEdge[],
    hoveredNode: SimNode | null,
    selectedNode: SimNode | null,
    width: number,
    height: number
  ): void {
    const ctx = this.textCtx;

    // Selected node: prominent title
    if (selectedNode) {
      const sp = selectedNode.particle;
      const [sr, sg, sb] = sectionColour(selectedNode.section);
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = `rgba(${(sr * 255) | 0}, ${(sg * 255) | 0}, ${(sb * 255) | 0}, 0.95)`;
      ctx.fillText(selectedNode.title, sp.pos.x, sp.pos.y - sp.radius - 6);
    }

    // Hovered node: tooltip with node info + connected edges
    if (hoveredNode) {
      const hp = hoveredNode.particle;
      let tx = hp.pos.x + hp.radius + 14;
      let ty = hp.pos.y - 30;

      // Gather info lines
      const lines: Array<{ text: string; font: string; colour: string }> = [];

      // Title
      lines.push({
        text: hoveredNode.title,
        font: 'bold 12px system-ui, sans-serif',
        colour: 'rgba(255, 255, 255, 0.95)'
      });

      // Section + type
      const [sr, sg, sb] = sectionColour(hoveredNode.section);
      lines.push({
        text: `${hoveredNode.section} · ${hoveredNode.nodeType}`,
        font: '11px system-ui, sans-serif',
        colour: `rgba(${(sr * 255) | 0}, ${(sg * 255) | 0}, ${(sb * 255) | 0}, 0.9)`
      });

      // Tags (may be string[] or comma-separated string from API)
      const tags = hoveredNode.tags;
      if (
        tags &&
        (typeof tags === 'string' ? tags.length > 0 : tags.length > 0)
      ) {
        const tagArr =
          typeof tags === 'string'
            ? tags.split(',').map((t: string) => t.trim())
            : tags;
        if (tagArr.length > 0) {
          lines.push({
            text: tagArr.slice(0, 4).join(', '),
            font: '10px system-ui, sans-serif',
            colour: 'rgba(160, 160, 160, 0.7)'
          });
        }
      }

      // Connections count
      lines.push({
        text: `${hoveredNode.degree} connections`,
        font: '10px system-ui, sans-serif',
        colour: 'rgba(140, 180, 220, 0.8)'
      });

      // Connected nodes (top 5)
      const connectedEdges = edges
        .filter(
          (e) =>
            e.source.id === hoveredNode.id || e.target.id === hoveredNode.id
        )
        .slice(0, 5);
      for (const edge of connectedEdges) {
        const other =
          edge.source.id === hoveredNode.id ? edge.target : edge.source;
        lines.push({
          text: `→ ${other.title.length > 25 ? other.title.slice(0, 23) + '..' : other.title}`,
          font: '10px system-ui, sans-serif',
          colour: 'rgba(180, 180, 180, 0.6)'
        });
      }

      // Measure max width
      let maxWidth = 0;
      for (const line of lines) {
        ctx.font = line.font;
        const w = ctx.measureText(line.text).width;
        if (w > maxWidth) maxWidth = w;
      }

      const boxWidth = maxWidth + 24;
      const boxHeight = lines.length * 17 + 16;

      // Clamp tooltip to stay within canvas
      if (tx + boxWidth > width - 10) tx = hp.pos.x - hp.radius - boxWidth - 10;
      if (ty + boxHeight > height - 10) ty = height - boxHeight - 10;
      if (ty < 5) ty = 5;

      // Dark semi-transparent background
      ctx.fillStyle = 'rgba(15, 15, 15, 0.92)';
      this.roundRect(ctx, tx, ty, boxWidth, boxHeight, 6);
      ctx.fill();

      // Draw lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      let lineY = ty + 9;
      for (const line of lines) {
        ctx.font = line.font;
        ctx.fillStyle = line.colour;
        ctx.fillText(line.text, tx + 12, lineY);
        lineY += 17;
      }

      // Also highlight edges connected to this node
      for (const edge of connectedEdges) {
        const sp = edge.source.particle;
        const tp = edge.target.particle;
        this.renderer.addLine(
          sp.pos.x,
          sp.pos.y,
          tp.pos.x,
          tp.pos.y,
          sr,
          sg,
          sb,
          0.8
        );
      }
      this.renderer.flushLines(width, height);
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
