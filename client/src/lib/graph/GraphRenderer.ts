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
  'explicit-link': [0.4, 0.4, 0.4, 0.5],
  'tag-similarity': [0.2, 0.4, 0.8, 0.4],
  'nlp-similarity': [0.6, 0.3, 0.7, 0.3],
  'dictionary-internal': [0.2, 0.7, 0.3, 0.4],
  'external-link': [0.9, 0.5, 0.1, 0.5],
  'comment-thread': [0.5, 0.5, 0.5, 0.3]
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

export type SearchMode = 'highlight' | 'filter';

export class GraphRenderer {
  private renderer: WebGLRenderer;
  private textCtx: CanvasRenderingContext2D;
  public gridStrength: number = 3000;

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
    hoveredEdge: SimEdge | null = null,
    mouseX: number = 0,
    mouseY: number = 0,
    showGrid: boolean = true,
    useSpatialHash: boolean = false,
    titleMatches: Set<string> | null = null,
    contentMatches: Set<string> | null = null,
    searchMode: SearchMode = 'highlight'
  ): void {
    // 1. Clear with solid white (needed for grid contrast, matching 404 page)
    this.renderer.clear(width, height, 1, 1, 1, 1);

    const nodes = sim.getNodes();
    const edges = sim.getEdges();
    const particles = sim.getParticles();
    const qt = sim.getQuadTree();

    // ── Search matching ─────────────────────────────────────────────
    // matchSet = all matches (title OR content). contentOnlySet = content but not title.
    const searching =
      (titleMatches && titleMatches.size > 0) ||
      (contentMatches && contentMatches.size > 0);

    let matchSet: Set<string> | null = null;
    let contentOnlySet: Set<string> | null = null;
    if (searching) {
      matchSet = new Set<string>();
      contentOnlySet = new Set<string>();
      if (titleMatches) {
        for (const id of titleMatches) matchSet.add(id);
      }
      if (contentMatches) {
        for (const id of contentMatches) {
          matchSet.add(id);
          if (!titleMatches?.has(id)) contentOnlySet.add(id);
        }
      }
    }

    const isFiltering = searching && searchMode === 'filter';
    const isHighlighting = searching && searchMode === 'highlight';

    // Pulsating glow for highlight mode (oscillates between 0.4 and 1.0)
    const pulseT = (Math.sin(performance.now() * 0.004) + 1) * 0.5;
    const pulseAlpha = 0.4 + pulseT * 0.6;

    // 2. Gravitational grid (warped by particle masses)
    this.renderer.drawGravitationalGrid(
      width,
      height,
      particles,
      qt,
      12,
      this.gridStrength
    );

    // 3. Spatial index visualization (toggle between QuadTree and SpatialHash)
    if (showGrid) {
      if (useSpatialHash) {
        const sh = sim.getSpatialHash();
        if (sh) this.renderer.drawSpatialHash(sh);
      } else {
        if (qt) this.renderer.drawQuadTree(qt);
      }
    }

    // 4. Draw edges
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const sp = edge.source.particle;
      const tp = edge.target.particle;

      // In filter mode, hide edges where neither endpoint matches
      if (isFiltering && matchSet) {
        if (!matchSet.has(edge.source.id) && !matchSet.has(edge.target.id)) {
          continue;
        }
      }

      // Highlight hovered edge
      if (hoveredEdge && edge === hoveredEdge) {
        this.renderer.addLine(
          sp.pos.x,
          sp.pos.y,
          tp.pos.x,
          tp.pos.y,
          0.85,
          0.45,
          0.15,
          1.0
        );
        this.renderer.addLine(
          sp.pos.x + 0.5,
          sp.pos.y + 0.5,
          tp.pos.x + 0.5,
          tp.pos.y + 0.5,
          0.85,
          0.45,
          0.15,
          0.7
        );
        this.renderer.addLine(
          sp.pos.x - 0.5,
          sp.pos.y - 0.5,
          tp.pos.x - 0.5,
          tp.pos.y - 0.5,
          0.85,
          0.45,
          0.15,
          0.7
        );
        continue;
      }

      const [er, eg, eb, ea] = edgeColour(edge.edgeType);

      // In highlight mode, dim edges not connected to matches
      let alpha = ea;
      if (isHighlighting && matchSet) {
        const srcMatch = matchSet.has(edge.source.id);
        const tgtMatch = matchSet.has(edge.target.id);
        if (!srcMatch && !tgtMatch) {
          alpha = ea * 0.15;
        }
      }

      this.renderer.addLine(
        sp.pos.x,
        sp.pos.y,
        tp.pos.x,
        tp.pos.y,
        er,
        eg,
        eb,
        alpha
      );
    }

    // 5. Draw nodes — filled circles
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const p = node.particle;
      const [r, g, b] = sectionColour(node.section);

      const isMatch = matchSet ? matchSet.has(node.id) : false;

      if (isFiltering && matchSet && !isMatch) {
        // Filter mode: hide non-matching nodes (draw very faint)
        this.renderer.addFilledCircle(
          p.pos.x,
          p.pos.y,
          p.radius,
          r,
          g,
          b,
          0.06
        );
        continue;
      }

      if (isHighlighting && matchSet && !isMatch) {
        // Highlight mode: dim non-matching nodes
        this.renderer.addFilledCircle(
          p.pos.x,
          p.pos.y,
          p.radius,
          r,
          g,
          b,
          0.15
        );
        continue;
      }

      // Normal or matching node
      this.renderer.addFilledCircle(p.pos.x, p.pos.y, p.radius, r, g, b, 1.0);

      // Title match: pulsating orange glow ring
      // Content-only match: subtler teal glow ring
      if (isMatch && contentOnlySet?.has(node.id)) {
        this.renderer.addCircle(
          p.pos.x,
          p.pos.y,
          p.radius + 4,
          0.2,
          0.6,
          0.7,
          pulseAlpha * 0.6
        );
        this.renderer.addCircle(
          p.pos.x,
          p.pos.y,
          p.radius + 2,
          0.2,
          0.6,
          0.7,
          pulseAlpha * 0.8
        );
      } else if (isMatch) {
        this.renderer.addCircle(
          p.pos.x,
          p.pos.y,
          p.radius + 5,
          0.85,
          0.45,
          0.15,
          pulseAlpha * 0.7
        );
        this.renderer.addCircle(
          p.pos.x,
          p.pos.y,
          p.radius + 2,
          0.85,
          0.45,
          0.15,
          pulseAlpha
        );
      }
    }

    // 6. Selected node highlight — white outer ring + section-coloured inner ring
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

    // Hovered node highlight — subtle white glow ring
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

    // 7. Flush: triangles, lines, filled circles, then circles (for highlights)
    this.renderer.flushTriangles(width, height);
    this.renderer.flushLines(width, height);
    this.renderer.flushFilledCircles(width, height);
    this.renderer.flushCircles(width, height);

    // 8. Text labels on the overlay canvas
    this.drawTextLabels(
      nodes,
      edges,
      hoveredNode,
      selectedNode,
      hoveredEdge,
      mouseX,
      mouseY,
      width,
      height,
      matchSet,
      contentOnlySet
    );
  }

  private drawTextLabels(
    nodes: SimNode[],
    edges: SimEdge[],
    hoveredNode: SimNode | null,
    selectedNode: SimNode | null,
    hoveredEdge: SimEdge | null,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    matchSet: Set<string> | null = null,
    contentOnlySet: Set<string> | null = null
  ): void {
    const ctx = this.textCtx;

    // ── Section centroid labels ──────────────────────────────────────
    const sectionCentroids: Map<
      string,
      { x: number; y: number; count: number }
    > = new Map();
    for (const node of nodes) {
      const entry = sectionCentroids.get(node.section) || {
        x: 0,
        y: 0,
        count: 0
      };
      entry.x += node.particle.pos.x;
      entry.y += node.particle.pos.y;
      entry.count++;
      sectionCentroids.set(node.section, entry);
    }
    for (const [section, { x, y, count }] of sectionCentroids) {
      const cx = x / count;
      const cy = y / count;
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const [r, g, b] = sectionColour(section);
      ctx.fillStyle = `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, 0.5)`;
      ctx.fillText(section.replace('dictionary-', ''), cx, cy);
    }

    // ── Node labels ──────────────────────────────────────────────────
    // When searching: label all matching nodes
    // Otherwise: label top 15 by degree
    const labelNodes = matchSet
      ? nodes.filter((n) => matchSet.has(n.id))
      : [...nodes].sort((a, b) => b.degree - a.degree).slice(0, 15);

    for (const node of labelNodes) {
      const isTitleMatch =
        matchSet?.has(node.id) && !contentOnlySet?.has(node.id);
      const isContentOnly = contentOnlySet?.has(node.id);
      const isMatch = isTitleMatch || isContentOnly;
      ctx.font = isMatch
        ? 'bold 10px system-ui, sans-serif'
        : '9px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isTitleMatch
        ? 'rgba(180, 90, 30, 0.95)'
        : isContentOnly
          ? 'rgba(40, 130, 150, 0.9)'
          : 'rgba(80, 80, 80, 0.7)';
      const label =
        node.title.length > 22 ? node.title.slice(0, 20) + '..' : node.title;
      ctx.fillText(
        label,
        node.particle.pos.x,
        node.particle.pos.y + node.particle.radius + 10
      );
    }

    // ── Node card: pinned (selected) or transient (hovered) ──────
    // Show selected node card, or hovered node card if different
    const cardNode = selectedNode || hoveredNode;
    if (cardNode) {
      this.drawNodeCard(ctx, cardNode, edges, width, height);
    }

    // ── Hovered edge: tooltip ──────────────────────────────────────
    if (!hoveredNode && hoveredEdge) {
      const lines: Array<{ text: string; font: string; colour: string }> = [];

      const srcTitle =
        hoveredEdge.source.title.length > 22
          ? hoveredEdge.source.title.slice(0, 20) + '..'
          : hoveredEdge.source.title;
      const tgtTitle =
        hoveredEdge.target.title.length > 22
          ? hoveredEdge.target.title.slice(0, 20) + '..'
          : hoveredEdge.target.title;

      lines.push({
        text: `${srcTitle} \u2194 ${tgtTitle}`,
        font: 'bold 11px system-ui, sans-serif',
        colour: 'rgba(30,30,30,0.95)'
      });
      lines.push({
        text: `Type: ${hoveredEdge.edgeType}`,
        font: '10px system-ui, sans-serif',
        colour: 'rgba(80,80,80,0.8)'
      });
      lines.push({
        text: `Weight: ${hoveredEdge.weight.toFixed(2)}`,
        font: '10px system-ui, sans-serif',
        colour: 'rgba(80,80,80,0.7)'
      });

      // Show shared tags for tag-similarity edges
      if (hoveredEdge.edgeType === 'tag-similarity') {
        const toArr = (t: string[] | string | undefined): string[] =>
          Array.isArray(t)
            ? t
            : typeof t === 'string'
              ? t
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
        const srcTags = new Set(toArr(hoveredEdge.source.tags));
        const shared = toArr(hoveredEdge.target.tags).filter((t) =>
          srcTags.has(t)
        );
        if (shared.length > 0) {
          lines.push({
            text: `Tags: ${shared.slice(0, 4).join(', ')}`,
            font: '10px system-ui, sans-serif',
            colour: 'rgba(100,100,100,0.7)'
          });
        }
      }

      let maxWidth = 0;
      for (const line of lines) {
        ctx.font = line.font;
        const w = ctx.measureText(line.text).width;
        if (w > maxWidth) maxWidth = w;
      }

      const boxWidth = maxWidth + 24;
      const boxHeight = lines.length * 17 + 16;
      let tx = mouseX + 12;
      let ty = mouseY - 20;

      if (tx + boxWidth > width - 10) tx = mouseX - boxWidth - 10;
      if (ty + boxHeight > height - 10) ty = height - boxHeight - 10;
      if (ty < 5) ty = 5;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.roundRect(ctx, tx, ty, boxWidth, boxHeight, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      let lineY = ty + 9;
      for (const line of lines) {
        ctx.font = line.font;
        ctx.fillStyle = line.colour;
        ctx.fillText(line.text, tx + 12, lineY);
        lineY += 17;
      }
    }
  }

  private drawNodeCard(
    ctx: CanvasRenderingContext2D,
    node: SimNode,
    edges: SimEdge[],
    width: number,
    height: number
  ): void {
    const hp = node.particle;
    let tx = hp.pos.x + hp.radius + 14;
    let ty = hp.pos.y - 30;

    const lines: Array<{
      text: string;
      font: string;
      colour: string;
      underline?: boolean;
    }> = [];

    // Title (display name)
    lines.push({
      text: node.title,
      font: 'bold 12px system-ui, sans-serif',
      colour: 'rgba(30, 30, 30, 0.95)'
    });

    // File path (smaller, below title)
    const shortPath =
      node.path.length > 40 ? '...' + node.path.slice(-37) : node.path;
    lines.push({
      text: shortPath,
      font: '9px system-ui, sans-serif',
      colour: 'rgba(120, 120, 120, 0.7)'
    });

    // Section + type
    const [sr, sg, sb] = sectionColour(node.section);
    lines.push({
      text: `${node.section} · ${node.nodeType}`,
      font: '11px system-ui, sans-serif',
      colour: `rgba(${(sr * 255) | 0}, ${(sg * 255) | 0}, ${(sb * 255) | 0}, 0.9)`
    });

    // Tags
    const tags = node.tags as string[] | string | undefined;
    if (tags) {
      const tagArr: string[] = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
          ? tags.split(',').map((t: string) => t.trim())
          : [];
      if (tagArr.length > 0) {
        lines.push({
          text: tagArr.slice(0, 4).join(', '),
          font: '10px system-ui, sans-serif',
          colour: 'rgba(100, 100, 100, 0.7)'
        });
      }
    }

    // Snippet
    if (node.snippet) {
      const snippet =
        node.snippet.length > 100
          ? node.snippet.slice(0, 97) + '...'
          : node.snippet;
      lines.push({
        text: snippet,
        font: 'italic 10px system-ui, sans-serif',
        colour: 'rgba(60, 60, 60, 0.8)'
      });
    }

    // Connections count
    lines.push({
      text: `${node.degree} connections`,
      font: '10px system-ui, sans-serif',
      colour: 'rgba(60, 120, 180, 0.8)'
    });

    // Connected nodes (top 5)
    const connectedEdges = edges
      .filter((e) => e.source.id === node.id || e.target.id === node.id)
      .slice(0, 5);
    for (const edge of connectedEdges) {
      const other = edge.source.id === node.id ? edge.target : edge.source;
      lines.push({
        text: `→ ${other.title.length > 25 ? other.title.slice(0, 23) + '..' : other.title}`,
        font: '10px system-ui, sans-serif',
        colour: 'rgba(80, 80, 80, 0.6)'
      });
    }

    // "Open page" link
    lines.push({
      text: 'Open page →',
      font: 'bold 11px system-ui, sans-serif',
      colour: 'rgba(200, 113, 55, 0.95)',
      underline: true
    });

    // Measure max width
    let maxWidth = 0;
    for (const line of lines) {
      ctx.font = line.font;
      const w = ctx.measureText(line.text).width;
      if (w > maxWidth) maxWidth = w;
    }

    const lineHeight = 17;
    const boxWidth = Math.max(maxWidth + 24, 220);
    const boxHeight = lines.length * lineHeight + 16;

    // Clamp tooltip to stay within canvas
    if (tx + boxWidth > width - 10) tx = hp.pos.x - hp.radius - boxWidth - 10;
    if (ty + boxHeight > height - 10) ty = height - boxHeight - 10;
    if (ty < 5) ty = 5;

    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    this.roundRect(ctx, tx, ty, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw lines
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let lineY = ty + 9;
    for (const line of lines) {
      ctx.font = line.font;
      ctx.fillStyle = line.colour;
      ctx.fillText(line.text, tx + 12, lineY);
      if (line.underline) {
        const tw = ctx.measureText(line.text).width;
        ctx.strokeStyle = line.colour;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx + 12, lineY + 13);
        ctx.lineTo(tx + 12 + tw, lineY + 13);
        ctx.stroke();
      }
      lineY += lineHeight;
    }

    // Highlight edges connected to this node
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
