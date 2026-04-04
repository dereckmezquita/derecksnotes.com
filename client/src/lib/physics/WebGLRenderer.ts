import { Vec2 } from './Vec2';
import { Particle } from './Particle';
import { QuadTree } from './QuadTree';
import { SpatialHash } from './SpatialHash';
import {
  LINE_VERTEX,
  LINE_FRAGMENT,
  CIRCLE_VERTEX,
  CIRCLE_FRAGMENT
} from './shaders';

interface ShaderProgram {
  program: WebGLProgram;
  attrs: Record<string, number>;
  uniforms: Record<string, WebGLUniformLocation>;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    const typeName = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';
    console.error(`${typeName} shader compile error:`, log);
    console.error('Shader source:', source);
    gl.deleteShader(shader);
    throw new Error(`${typeName} shader compilation failed: ${log}`);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string
): WebGLProgram {
  const vert = createShader(gl, gl.VERTEX_SHADER, vs);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fs);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    throw new Error('Program linking failed');
  }
  return prog;
}

const ORANGE = [0.72, 0.4, 0.22]; // hsla(22, 85%, 38%)
const GRID_COLOR = [0.85, 0.85, 0.85]; // light grey
const BLUE_QT = [0.47, 0.6, 0.72]; // quadtree blue

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private lineProgram: ShaderProgram;
  private circleProgram: ShaderProgram;
  private lineBuffer: WebGLBuffer;
  private circleBuffer: WebGLBuffer;
  private triBuffer: WebGLBuffer;

  // Reusable arrays to avoid GC pressure
  private lineData: Float32Array;
  private lineCount: number = 0;
  private circleData: Float32Array;
  private circleCount: number = 0;
  private triData: Float32Array;
  private triCount: number = 0; // count of triangles (3 verts each)

  // Text overlay canvas
  private textCtx: CanvasRenderingContext2D;

  constructor(gl: WebGLRenderingContext, textCtx: CanvasRenderingContext2D) {
    this.gl = gl;
    this.textCtx = textCtx;

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Line program
    const lineProg = createProgram(gl, LINE_VERTEX, LINE_FRAGMENT);
    this.lineProgram = {
      program: lineProg,
      attrs: {
        aPosition: gl.getAttribLocation(lineProg, 'aPosition'),
        aColor: gl.getAttribLocation(lineProg, 'aColor')
      },
      uniforms: {
        uResolution: gl.getUniformLocation(lineProg, 'uResolution')!
      }
    };

    // Circle program
    const circleProg = createProgram(gl, CIRCLE_VERTEX, CIRCLE_FRAGMENT);
    this.circleProgram = {
      program: circleProg,
      attrs: {
        aPosition: gl.getAttribLocation(circleProg, 'aPosition'),
        aRadius: gl.getAttribLocation(circleProg, 'aRadius'),
        aColor: gl.getAttribLocation(circleProg, 'aColor')
      },
      uniforms: {
        uResolution: gl.getUniformLocation(circleProg, 'uResolution')!
      }
    };

    this.lineBuffer = gl.createBuffer()!;
    this.circleBuffer = gl.createBuffer()!;
    this.triBuffer = gl.createBuffer()!;

    // Pre-allocate buffers (6 floats per vertex: x, y, r, g, b, a)
    this.lineData = new Float32Array(2400000); // ~200k lines
    this.circleData = new Float32Array(50000);
    this.triData = new Float32Array(2000000); // for thick lines, rects, arrow tips
  }

  clear(w: number, h: number, bgR = 1, bgG = 1, bgB = 1, bgA = 1): void {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(bgR, bgG, bgB, bgA);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.lineCount = 0;
    this.circleCount = 0;
    this.triCount = 0;

    // Clear text overlay
    this.textCtx.clearRect(0, 0, w, h);
  }

  // ---- Line batching ----

  public addLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void {
    const i = this.lineCount * 12; // 2 vertices × 6 floats
    if (i + 12 > this.lineData.length) return; // buffer full
    this.lineData[i] = x1;
    this.lineData[i + 1] = y1;
    this.lineData[i + 2] = r;
    this.lineData[i + 3] = g;
    this.lineData[i + 4] = b;
    this.lineData[i + 5] = a;
    this.lineData[i + 6] = x2;
    this.lineData[i + 7] = y2;
    this.lineData[i + 8] = r;
    this.lineData[i + 9] = g;
    this.lineData[i + 10] = b;
    this.lineData[i + 11] = a;
    this.lineCount++;
  }

  public addCircle(
    x: number,
    y: number,
    radius: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void {
    const i = this.circleCount * 7; // 1 vertex × 7 floats (x, y, radius, r, g, b, a)
    if (i + 7 > this.circleData.length) return;
    this.circleData[i] = x;
    this.circleData[i + 1] = y;
    this.circleData[i + 2] = radius;
    this.circleData[i + 3] = r;
    this.circleData[i + 4] = g;
    this.circleData[i + 5] = b;
    this.circleData[i + 6] = a;
    this.circleCount++;
  }

  /**
   * Draw a thick line as a quad (2 triangles).
   * Computes perpendicular offset from line direction to create width.
   * thickness = line width in pixels
   */
  public addThickLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    thickness: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void {
    const i = this.triCount * 36;
    if (i + 36 > this.triData.length) return;

    // Direction of line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.01) return;

    // Perpendicular direction (normal to line), scaled to half-thickness
    const hw = thickness * 0.5;
    const nx = (-dy / len) * hw; // perpendicular x
    const ny = (dx / len) * hw; // perpendicular y

    // 4 corners of the quad
    const ax = x1 + nx,
      ay = y1 + ny; // top-left
    const bx = x1 - nx,
      by = y1 - ny; // bottom-left
    const cx = x2 + nx,
      cy = y2 + ny; // top-right
    const ex = x2 - nx,
      ey = y2 - ny; // bottom-right

    // Two triangles: (a, c, b) and (b, c, e)
    const verts = [
      ax,
      ay,
      r,
      g,
      b,
      a,
      cx,
      cy,
      r,
      g,
      b,
      a,
      bx,
      by,
      r,
      g,
      b,
      a,
      bx,
      by,
      r,
      g,
      b,
      a,
      cx,
      cy,
      r,
      g,
      b,
      a,
      ex,
      ey,
      r,
      g,
      b,
      a
    ];
    for (let j = 0; j < 36; j++) this.triData[i + j] = verts[j];
    this.triCount++;
  }

  /**
   * Draw a filled triangle (3 vertices).
   * Used for arrowhead tips on velocity vectors.
   */
  public addFilledTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void {
    const i = this.triCount * 36;
    if (i + 36 > this.triData.length) return;

    // Only 3 vertices needed but triCount expects 6-vertex blocks (2 triangles)
    // Degenerate second triangle (all same point) — GPU discards it
    const verts = [
      x1,
      y1,
      r,
      g,
      b,
      a,
      x2,
      y2,
      r,
      g,
      b,
      a,
      x3,
      y3,
      r,
      g,
      b,
      a,
      x3,
      y3,
      r,
      g,
      b,
      a,
      x3,
      y3,
      r,
      g,
      b,
      a,
      x3,
      y3,
      r,
      g,
      b,
      a
    ];
    for (let j = 0; j < 36; j++) this.triData[i + j] = verts[j];
    this.triCount++;
  }

  public addRect(
    x: number,
    y: number,
    rw: number,
    rh: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void {
    const i = this.triCount * 36;
    if (i + 36 > this.triData.length) return;
    // Two triangles
    const verts = [
      x,
      y,
      r,
      g,
      b,
      a,
      x + rw,
      y,
      r,
      g,
      b,
      a,
      x,
      y + rh,
      r,
      g,
      b,
      a,
      x + rw,
      y,
      r,
      g,
      b,
      a,
      x + rw,
      y + rh,
      r,
      g,
      b,
      a,
      x,
      y + rh,
      r,
      g,
      b,
      a
    ];
    for (let j = 0; j < 36; j++) this.triData[i + j] = verts[j];
    this.triCount++;
  }

  flushTriangles(w: number, h: number): void {
    if (this.triCount === 0) return;
    const gl = this.gl;
    const p = this.lineProgram;
    gl.useProgram(p.program);
    gl.uniform2f(p.uniforms.uResolution, w, h);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.triData.subarray(0, this.triCount * 36),
      gl.DYNAMIC_DRAW
    );
    gl.enableVertexAttribArray(p.attrs.aPosition);
    gl.vertexAttribPointer(p.attrs.aPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(p.attrs.aColor);
    gl.vertexAttribPointer(p.attrs.aColor, 4, gl.FLOAT, false, 24, 8);
    gl.drawArrays(gl.TRIANGLES, 0, this.triCount * 6);
    this.triCount = 0;
  }

  flushLines(w: number, h: number): void {
    if (this.lineCount === 0) return;
    const gl = this.gl;
    const p = this.lineProgram;

    gl.useProgram(p.program);
    gl.uniform2f(p.uniforms.uResolution, w, h);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.lineData.subarray(0, this.lineCount * 12),
      gl.DYNAMIC_DRAW
    );

    // Position: 2 floats, stride 24 bytes, offset 0
    gl.enableVertexAttribArray(p.attrs.aPosition);
    gl.vertexAttribPointer(p.attrs.aPosition, 2, gl.FLOAT, false, 24, 0);

    // Color: 4 floats, stride 24 bytes, offset 8
    gl.enableVertexAttribArray(p.attrs.aColor);
    gl.vertexAttribPointer(p.attrs.aColor, 4, gl.FLOAT, false, 24, 8);

    gl.drawArrays(gl.LINES, 0, this.lineCount * 2);
    this.lineCount = 0;
  }

  flushCircles(w: number, h: number): void {
    if (this.circleCount === 0) return;
    const gl = this.gl;
    const p = this.circleProgram;

    gl.useProgram(p.program);
    gl.uniform2f(p.uniforms.uResolution, w, h);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.circleData.subarray(0, this.circleCount * 7),
      gl.DYNAMIC_DRAW
    );

    const stride = 28; // 7 floats × 4 bytes

    gl.enableVertexAttribArray(p.attrs.aPosition);
    gl.vertexAttribPointer(p.attrs.aPosition, 2, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(p.attrs.aRadius);
    gl.vertexAttribPointer(p.attrs.aRadius, 1, gl.FLOAT, false, stride, 8);

    gl.enableVertexAttribArray(p.attrs.aColor);
    gl.vertexAttribPointer(p.attrs.aColor, 4, gl.FLOAT, false, stride, 12);

    gl.drawArrays(gl.POINTS, 0, this.circleCount);
    this.circleCount = 0;
  }

  // ---- Drawing methods (matching Canvas 2D Renderer API) ----

  /**
   * Density field approach: instead of querying the quadtree for each grid point,
   * we loop over particles once and "stamp" each particle's gravitational pull
   * onto nearby grid cells. This is O(particles × stampRadius²) instead of
   * O(gridPoints × nearbyParticles).
   *
   * For 1000 particles with stampRadius=12 cells: ~1000 × 144 = 144,000 ops
   * Old approach with 14,400 grid points × ~10 nearby: ~144,000 ops
   * Similar count BUT no quadtree traversal, no Vec2 allocation, no sqrt per query.
   */
  drawGravitationalGrid(
    w: number,
    h: number,
    particles: Particle[],
    _qt: QuadTree | null, // kept in signature for compatibility, not used
    spacing: number = 12,
    strength: number = 800
  ): void {
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const influenceRadius = 150;
    const influenceCells = Math.ceil(influenceRadius / spacing);
    const maxPull = spacing * 0.8;

    // Force field: dx,dy displacement for each grid point
    // Initialize to zero
    const displaced = new Float32Array(cols * rows * 2);

    // First pass: set base positions
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = (row * cols + col) * 2;
        displaced[idx] = col * spacing;
        displaced[idx + 1] = row * spacing;
      }
    }

    // Second pass: stamp each particle's influence onto nearby grid cells
    for (const p of particles) {
      // Which grid cell is this particle in?
      const centerCol = Math.round(p.pos.x / spacing);
      const centerRow = Math.round(p.pos.y / spacing);

      // Stamp onto surrounding cells within influence radius
      const minCol = Math.max(0, centerCol - influenceCells);
      const maxCol = Math.min(cols - 1, centerCol + influenceCells);
      const minRow = Math.max(0, centerRow - influenceCells);
      const maxRow = Math.min(rows - 1, centerRow + influenceCells);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const baseX = col * spacing;
          const baseY = row * spacing;
          const diffX = p.pos.x - baseX;
          const diffY = p.pos.y - baseY;
          const distSq = diffX * diffX + diffY * diffY;

          // Skip if outside influence radius (squared comparison, no sqrt)
          if (distSq > influenceRadius * influenceRadius) continue;

          const dist = Math.sqrt(distSq) + 1;
          const pull = Math.min((strength * p.mass) / (distSq + 500), maxPull);

          const idx = (row * cols + col) * 2;
          displaced[idx] += (diffX / dist) * pull;
          displaced[idx + 1] += (diffY / dist) * pull;
        }
      }
    }

    const [r, g, b] = GRID_COLOR;

    // Horizontal lines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const i1 = (row * cols + col) * 2;
        const i2 = (row * cols + col + 1) * 2;
        this.addLine(
          displaced[i1],
          displaced[i1 + 1],
          displaced[i2],
          displaced[i2 + 1],
          r,
          g,
          b,
          0.6
        );
      }
    }

    // Vertical lines
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 1; row++) {
        const i1 = (row * cols + col) * 2;
        const i2 = ((row + 1) * cols + col) * 2;
        this.addLine(
          displaced[i1],
          displaced[i1 + 1],
          displaced[i2],
          displaced[i2 + 1],
          r,
          g,
          b,
          0.6
        );
      }
    }
  }

  drawQuadTree(qt: QuadTree): void {
    const [r, g, b] = BLUE_QT;
    qt.forEachNode((bounds, hasParticles, isLeaf) => {
      // Grid outline — draw doubled for visibility
      const a = 0.3;
      this.addLine(
        bounds.x,
        bounds.y,
        bounds.x + bounds.w,
        bounds.y,
        r,
        g,
        b,
        a
      );
      this.addLine(
        bounds.x + bounds.w,
        bounds.y,
        bounds.x + bounds.w,
        bounds.y + bounds.h,
        r,
        g,
        b,
        a
      );
      this.addLine(
        bounds.x + bounds.w,
        bounds.y + bounds.h,
        bounds.x,
        bounds.y + bounds.h,
        r,
        g,
        b,
        a
      );
      this.addLine(
        bounds.x,
        bounds.y + bounds.h,
        bounds.x,
        bounds.y,
        r,
        g,
        b,
        a
      );

      // Fill occupied leaf cells with transparent blue rectangle
      if (hasParticles && isLeaf) {
        this.addRect(bounds.x, bounds.y, bounds.w, bounds.h, r, g, b, 0.15);
      }
    });
  }

  drawSpatialHash(hash: SpatialHash): void {
    const cs = hash.getCellSize();
    const cols = hash.getCols();
    const rows = hash.getRows();

    // Draw grid lines (faint)
    for (let c = 0; c <= cols; c++) {
      const x = c * cs;
      this.addLine(x, 0, x, rows * cs, 0.75, 0.75, 0.75, 0.2);
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * cs;
      this.addLine(0, y, cols * cs, y, 0.75, 0.75, 0.75, 0.2);
    }

    // Heatmap fill — color intensity scales with particle count
    hash.forEachCell(({ x, y, w, h, count }) => {
      // Interpolate from cool blue (1 particle) to warm orange (8+)
      const t = Math.min(count / 8, 1);
      const r = 0.47 + t * 0.25; // blue → orange-ish
      const g = 0.6 - t * 0.2;
      const b = 0.72 - t * 0.5;
      const a = 0.1 + t * 0.2;
      this.addRect(x, y, w, h, r, g, b, a);
    });
  }

  drawTrails(particles: Particle[], maxLen: number = 80): void {
    const [r, g, b] = ORANGE;
    for (const p of particles) {
      const trail = p.trail;
      const len = Math.min(trail.length, maxLen);
      const start = trail.length - len;
      for (let i = start + 1; i < trail.length; i++) {
        const t = (i - start) / len;
        const alpha = t * 0.5;
        // Proper thick trail using triangle quads — tapers from 0.5px to 2px
        const thickness = 0.5 + t * 1.5;
        this.addThickLine(
          trail[i - 1].x,
          trail[i - 1].y,
          trail[i].x,
          trail[i].y,
          thickness,
          r,
          g,
          b,
          alpha
        );
      }
    }
  }

  drawVelocityVectors(particles: Particle[]): void {
    const [r, g, b] = ORANGE;
    for (const p of particles) {
      const scale = 10;
      const vx = p.vel.x * scale;
      const vy = p.vel.y * scale;
      const ex = p.pos.x + vx;
      const ey = p.pos.y + vy;

      // Vector line — matches trail thickness
      this.addThickLine(p.pos.x, p.pos.y, ex, ey, 1.5, r, g, b, 0.8);

      // Filled triangle arrowhead
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 1) {
        const angle = Math.atan2(vy, vx);
        const headLen = 10;
        const headWidth = 6;
        // Tip of the arrow
        const tipX = ex;
        const tipY = ey;
        // Two base points of the triangle
        const baseAngle1 = angle + Math.PI - 0.4;
        const baseAngle2 = angle + Math.PI + 0.4;
        this.addFilledTriangle(
          tipX,
          tipY,
          tipX + headLen * Math.cos(baseAngle1),
          tipY + headLen * Math.sin(baseAngle1),
          tipX + headLen * Math.cos(baseAngle2),
          tipY + headLen * Math.sin(baseAngle2),
          r,
          g,
          b,
          0.85
        );
      }
    }
  }

  drawParticles(particles: Particle[]): void {
    const [r, g, b] = ORANGE;
    for (const p of particles) {
      if (p.isBlackHole) {
        const lifeRatio = p.blackHoleAge / Particle.BLACK_HOLE_LIFETIME;
        const fade = Math.max(0.15, 1.0 - lifeRatio);

        // MASSIVE accretion disk — impossible to miss
        this.addCircle(p.pos.x, p.pos.y, 150, 1.0, 0.4, 0.0, 0.2 * fade);
        this.addCircle(p.pos.x, p.pos.y, 120, 1.0, 0.5, 0.0, 0.35 * fade);
        this.addCircle(p.pos.x, p.pos.y, 90, 1.0, 0.65, 0.05, 0.5 * fade);
        this.addCircle(p.pos.x, p.pos.y, 60, 1.0, 0.8, 0.2, 0.7 * fade);
        this.addCircle(p.pos.x, p.pos.y, 40, 1.0, 0.9, 0.4, 0.85 * fade);
        this.addCircle(p.pos.x, p.pos.y, 25, 1.0, 1.0, 0.7, 0.95 * fade);
        this.addCircle(p.pos.x, p.pos.y, 15, 1.0, 1.0, 0.9, 1.0);

        // Dark core
        this.addCircle(p.pos.x, p.pos.y, p.radius, 0.0, 0.0, 0.0, 1.0);

        // MASSIVE polar jets — 500px spears of light from both poles
        const jetLen = 500 * fade;
        const jetW = 15;
        for (let offset = -jetW; offset <= jetW; offset++) {
          const t = Math.abs(offset) / jetW;
          const intensity = (1.0 - t) * (1.0 - t); // quadratic falloff — very bright center

          // Top jet
          this.addLine(
            p.pos.x + offset,
            p.pos.y - p.radius,
            p.pos.x + offset * 1.5,
            p.pos.y - p.radius - jetLen * intensity,
            0.5,
            0.7,
            1.0,
            intensity * 0.95 * fade
          );
          // Bottom jet
          this.addLine(
            p.pos.x + offset,
            p.pos.y + p.radius,
            p.pos.x + offset * 1.5,
            p.pos.y + p.radius + jetLen * intensity,
            0.5,
            0.7,
            1.0,
            intensity * 0.95 * fade
          );
        }
        // Bright white inner core of jets
        for (let offset = -4; offset <= 4; offset++) {
          this.addLine(
            p.pos.x + offset,
            p.pos.y - p.radius,
            p.pos.x + offset,
            p.pos.y - p.radius - jetLen * 0.7,
            0.9,
            0.95,
            1.0,
            0.95 * fade
          );
          this.addLine(
            p.pos.x + offset,
            p.pos.y + p.radius,
            p.pos.x + offset,
            p.pos.y + p.radius + jetLen * 0.7,
            0.9,
            0.95,
            1.0,
            0.95 * fade
          );
        }

        continue;
      }

      this.addCircle(p.pos.x, p.pos.y, p.radius, r, g, b, 1.0);

      // Short crosshair — starts at visible ring edge, extends 15% beyond
      const inner = p.radius * 0.88; // matches where the shader draws the ring
      const outer = p.radius * 1.03; // extends just beyond the ring
      const a = 0.6;
      const cw = 2;
      // Horizontal arms
      this.addThickLine(
        p.pos.x - outer,
        p.pos.y,
        p.pos.x - inner,
        p.pos.y,
        cw,
        r,
        g,
        b,
        a
      );
      this.addThickLine(
        p.pos.x + inner,
        p.pos.y,
        p.pos.x + outer,
        p.pos.y,
        cw,
        r,
        g,
        b,
        a
      );
      // Vertical arms
      this.addThickLine(
        p.pos.x,
        p.pos.y - outer,
        p.pos.x,
        p.pos.y - inner,
        cw,
        r,
        g,
        b,
        a
      );
      this.addThickLine(
        p.pos.x,
        p.pos.y + inner,
        p.pos.x,
        p.pos.y + outer,
        cw,
        r,
        g,
        b,
        a
      );
    }
  }

  drawSlingshot(start: Vec2, mouse: Vec2, previewRadius: number): void {
    const [r, g, b] = ORANGE;
    const delta = start.sub(mouse);
    const dist = delta.length();
    const angle = delta.angle();

    // Pull line
    this.addLine(start.x, start.y, mouse.x, mouse.y, r, g, b, 0.4);

    // Launch arrow
    const arrowLen = Math.min(dist * 0.6, 80);
    const ax = start.x + Math.cos(angle) * arrowLen;
    const ay = start.y + Math.sin(angle) * arrowLen;
    this.addLine(start.x, start.y, ax, ay, r, g, b, 0.7);
    this.addLine(
      ax,
      ay,
      ax - 8 * Math.cos(angle - 0.35),
      ay - 8 * Math.sin(angle - 0.35),
      r,
      g,
      b,
      0.7
    );
    this.addLine(
      ax,
      ay,
      ax - 8 * Math.cos(angle + 0.35),
      ay - 8 * Math.sin(angle + 0.35),
      r,
      g,
      b,
      0.7
    );

    // Preview circle as crosshair
    this.addCircle(start.x, start.y, previewRadius, r, g, b, 0.5);
  }

  drawGroundLine(y: number, w: number): void {
    // Dashed line as segments
    const gap = 10;
    for (let x = 0; x < w; x += gap) {
      this.addLine(x, y, Math.min(x + gap * 0.6, w), y, 0.3, 0.3, 0.3, 0.35);
    }
  }

  drawDimLines(particles: Particle[], maxDist: number): void {
    const limit = Math.min(particles.length, 30);
    for (let i = 0; i < limit; i++) {
      for (let j = i + 1; j < limit; j++) {
        const dist = particles[i].pos.distTo(particles[j].pos);
        if (dist < maxDist && dist > 35) {
          this.addLine(
            particles[i].pos.x,
            particles[i].pos.y,
            particles[j].pos.x,
            particles[j].pos.y,
            0.3,
            0.3,
            0.3,
            0.15
          );
        }
      }
    }
  }

  // ---- Text overlay (Canvas 2D) ----

  drawAnnotations(particles: Particle[], count: number): void {
    const ctx = this.textCtx;
    ctx.font = '10px Roboto, sans-serif';
    const limit = Math.min(count, particles.length);
    for (let i = 0; i < limit; i++) {
      const p = particles[i];
      const speed = p.speed();
      const ke = p.kineticEnergy();
      const ang = p.vel.angle() * (180 / Math.PI);
      const ox = p.pos.x + p.radius + 22;
      const oy = p.pos.y - p.radius;

      ctx.fillStyle = 'hsla(22, 85%, 38%, 0.85)';
      ctx.fillText(`|v| = ${speed.toFixed(1)}`, ox, oy);
      ctx.fillStyle = 'hsla(0, 0%, 30%, 0.75)';
      ctx.fillText(`\u03B8 = ${ang.toFixed(0)}\u00B0`, ox, oy + 12);
      ctx.fillText(`KE = ${ke.toFixed(0)}`, ox, oy + 24);
    }
  }

  drawParticleLabels(particles: Particle[]): void {
    const ctx = this.textCtx;
    for (const p of particles) {
      const cr = p.radius + 5;
      ctx.font = '10px Roboto, sans-serif';
      ctx.fillStyle = 'hsla(22, 85%, 38%, 0.9)';
      ctx.fillText(`P${p.id}`, p.pos.x + cr + 3, p.pos.y - 4);
      ctx.font = '9px Roboto, sans-serif';
      ctx.fillStyle = 'hsla(0, 0%, 30%, 0.7)';
      ctx.fillText(`r=${p.radius.toFixed(1)}`, p.pos.x + cr + 3, p.pos.y + 8);
    }
  }

  drawAxes(): void {
    const ctx = this.textCtx;
    // Draw axes lines via WebGL
    this.addLine(16, 50, 16, 18, 0.3, 0.3, 0.3, 0.55);
    this.addLine(16, 50, 48, 50, 0.3, 0.3, 0.3, 0.55);
    this.addLine(16, 18, 13, 23, 0.3, 0.3, 0.3, 0.55);
    this.addLine(16, 18, 19, 23, 0.3, 0.3, 0.3, 0.55);
    this.addLine(48, 50, 43, 47, 0.3, 0.3, 0.3, 0.55);
    this.addLine(48, 50, 43, 53, 0.3, 0.3, 0.3, 0.55);
    // Labels via text
    ctx.font = '10px Roboto, sans-serif';
    ctx.fillStyle = 'hsla(0, 0%, 30%, 0.6)';
    ctx.fillText('y', 6, 22);
    ctx.fillText('x', 50, 54);
  }

  drawScaleBar(w: number): void {
    this.addLine(w - 62, 18, w - 12, 18, 0.3, 0.3, 0.3, 0.5);
    this.addLine(w - 62, 14, w - 62, 22, 0.3, 0.3, 0.3, 0.5);
    this.addLine(w - 12, 14, w - 12, 22, 0.3, 0.3, 0.3, 0.5);
    this.textCtx.font = '10px Roboto, sans-serif';
    this.textCtx.fillStyle = 'hsla(0, 0%, 30%, 0.6)';
    this.textCtx.fillText('50px', w - 50, 14);
  }
}
