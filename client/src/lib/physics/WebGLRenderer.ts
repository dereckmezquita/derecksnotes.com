import { Vec2 } from './Vec2';
import { Particle } from './Particle';
import { QuadTree } from './QuadTree';
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
        this.lineData = new Float32Array(600000);
        this.circleData = new Float32Array(50000);
        this.triData = new Float32Array(300000); // for filled rectangles
    }

    clear(w: number, h: number): void {
        const gl = this.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.lineCount = 0;
        this.circleCount = 0;
        this.triCount = 0;

        // Clear text overlay
        this.textCtx.clearRect(0, 0, w, h);
    }

    // ---- Line batching ----

    private addLine(
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

    private addCircle(
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
        gl.vertexAttribPointer(
            p.attrs.aPosition,
            2,
            gl.FLOAT,
            false,
            stride,
            0
        );

        gl.enableVertexAttribArray(p.attrs.aRadius);
        gl.vertexAttribPointer(p.attrs.aRadius, 1, gl.FLOAT, false, stride, 8);

        gl.enableVertexAttribArray(p.attrs.aColor);
        gl.vertexAttribPointer(p.attrs.aColor, 4, gl.FLOAT, false, stride, 12);

        gl.drawArrays(gl.POINTS, 0, this.circleCount);
        this.circleCount = 0;
    }

    // ---- Drawing methods (matching Canvas 2D Renderer API) ----

    drawGravitationalGrid(
        w: number,
        h: number,
        particles: Particle[],
        qt: QuadTree,
        spacing: number = 12,
        strength: number = 800
    ): void {
        const cols = Math.ceil(w / spacing) + 1;
        const rows = Math.ceil(h / spacing) + 1;
        const influenceRadius = 150;

        // Build displaced grid
        const displaced: Float32Array = new Float32Array(cols * rows * 2);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const baseX = col * spacing;
                const baseY = row * spacing;
                let dx = 0,
                    dy = 0;

                const nearby = qt.queryRadius(
                    Vec2.from(baseX, baseY),
                    influenceRadius
                );
                for (const p of nearby) {
                    const diffX = p.pos.x - baseX;
                    const diffY = p.pos.y - baseY;
                    const distSq = diffX * diffX + diffY * diffY;
                    const dist = Math.sqrt(distSq) + 1;
                    const pull = Math.min(
                        (strength * p.mass) / (distSq + 500),
                        spacing * 0.8
                    );
                    dx += (diffX / dist) * pull;
                    dy += (diffY / dist) * pull;
                }

                const idx = (row * cols + col) * 2;
                displaced[idx] = baseX + dx;
                displaced[idx + 1] = baseY + dy;
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

            // Fill occupied leaf cells with blue shading
            if (hasParticles && isLeaf) {
                const step = 2;
                for (let y = bounds.y; y < bounds.y + bounds.h; y += step) {
                    this.addLine(
                        bounds.x,
                        y,
                        bounds.x + bounds.w,
                        y,
                        r,
                        g,
                        b,
                        0.12
                    );
                }
            }
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
                // Draw multiple parallel lines for thickness (WebGL1 lines are 1px)
                const x1 = trail[i - 1].x,
                    y1 = trail[i - 1].y;
                const x2 = trail[i].x,
                    y2 = trail[i].y;
                this.addLine(x1, y1, x2, y2, r, g, b, alpha);
                if (t > 0.3) {
                    this.addLine(x1, y1 + 1, x2, y2 + 1, r, g, b, alpha * 0.7);
                    this.addLine(x1, y1 - 1, x2, y2 - 1, r, g, b, alpha * 0.7);
                }
            }
        }
    }

    drawVelocityVectors(particles: Particle[]): void {
        const [r, g, b] = ORANGE;
        for (const p of particles) {
            const ex = p.pos.x + p.vel.x * 5;
            const ey = p.pos.y + p.vel.y * 5;
            // Thicker vector line
            this.addLine(p.pos.x, p.pos.y, ex, ey, r, g, b, 0.8);
            this.addLine(p.pos.x, p.pos.y + 1, ex, ey + 1, r, g, b, 0.5);

            // Arrowhead
            const angle = p.vel.angle();
            this.addLine(
                ex,
                ey,
                ex - 6 * Math.cos(angle - 0.4),
                ey - 6 * Math.sin(angle - 0.4),
                r,
                g,
                b,
                0.8
            );
            this.addLine(
                ex,
                ey,
                ex - 6 * Math.cos(angle + 0.4),
                ey - 6 * Math.sin(angle + 0.4),
                r,
                g,
                b,
                0.8
            );
        }
    }

    drawParticles(particles: Particle[]): void {
        const [r, g, b] = ORANGE;
        for (const p of particles) {
            this.addCircle(p.pos.x, p.pos.y, p.radius, r, g, b, 1.0);

            // Thick crosshair lines (draw 3 parallel lines for thickness)
            const cr = p.radius + 6;
            const gap = p.radius * 0.35;
            const a = 0.7;
            for (let offset = -1; offset <= 1; offset++) {
                // Horizontal
                this.addLine(
                    p.pos.x - cr,
                    p.pos.y + offset,
                    p.pos.x - gap,
                    p.pos.y + offset,
                    r,
                    g,
                    b,
                    a
                );
                this.addLine(
                    p.pos.x + gap,
                    p.pos.y + offset,
                    p.pos.x + cr,
                    p.pos.y + offset,
                    r,
                    g,
                    b,
                    a
                );
                // Vertical
                this.addLine(
                    p.pos.x + offset,
                    p.pos.y - cr,
                    p.pos.x + offset,
                    p.pos.y - gap,
                    r,
                    g,
                    b,
                    a
                );
                this.addLine(
                    p.pos.x + offset,
                    p.pos.y + gap,
                    p.pos.x + offset,
                    p.pos.y + cr,
                    r,
                    g,
                    b,
                    a
                );
            }
        }
    }

    drawMouseAttractor(
        mouse: Vec2,
        particles: Particle[],
        range: number
    ): void {
        const [r, g, b] = ORANGE;
        // Crosshair at mouse
        this.addLine(mouse.x - 6, mouse.y, mouse.x + 6, mouse.y, r, g, b, 0.4);
        this.addLine(mouse.x, mouse.y - 6, mouse.x, mouse.y + 6, r, g, b, 0.4);

        // Lines to nearby particles
        for (const p of particles) {
            if (p.pos.distTo(mouse) < range) {
                this.addLine(p.pos.x, p.pos.y, mouse.x, mouse.y, r, g, b, 0.07);
            }
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
            this.addLine(
                x,
                y,
                Math.min(x + gap * 0.6, w),
                y,
                0.3,
                0.3,
                0.3,
                0.35
            );
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
            ctx.fillText(
                `r=${p.radius.toFixed(1)}`,
                p.pos.x + cr + 3,
                p.pos.y + 8
            );
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
