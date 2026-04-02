'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    mass: number;
    trail: Array<{ x: number; y: number }>;
    id: number;
}

let nextId = 0;

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gravityOn, setGravityOn] = useState(false);
    const [attractOn, setAttractOn] = useState(false);
    const [ballSize, setBallSize] = useState(12);
    const gravityRef = useRef(false);
    const attractRef = useRef(false);
    const ballSizeRef = useRef(12);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        gravityRef.current = gravityOn;
    }, [gravityOn]);
    useEffect(() => {
        attractRef.current = attractOn;
    }, [attractOn]);
    useEffect(() => {
        ballSizeRef.current = ballSize;
    }, [ballSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const dpr = window.devicePixelRatio || 1;

        function resize() {
            if (!canvas) return;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resize();
        window.addEventListener('resize', resize);

        const W = () => window.innerWidth;
        const H = () => window.innerHeight;

        const G = 0.1;
        const INTER_G = 0.3;
        const damping = 0.85;
        const MOUSE_ATTRACT = 0.4;
        const TRAIL_LEN = 80;

        const o = (a: number) => `hsla(22, 85%, 38%, ${a})`;
        const gr = (a: number) => `hsla(0, 0%, 30%, ${a})`;

        const particles = particlesRef.current;
        if (particles.length === 0) {
            for (let i = 0; i < 14; i++) {
                const r = 6 + Math.random() * 16;
                particles.push({
                    x: 50 + Math.random() * (W() - 100),
                    y: 30 + Math.random() * (H() * 0.6),
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 4,
                    r,
                    mass: r * r,
                    trail: [],
                    id: nextId++
                });
            }
        }

        let frame = 0;
        let totalKE = 0;
        let totalPE = 0;
        let collisionCount = 0;
        let dragStart: { x: number; y: number } | null = null;
        let isDragging = false;

        function getCanvasPos(e: MouseEvent) {
            return { x: e.clientX, y: e.clientY };
        }

        function onMouseMove(e: MouseEvent) {
            const pos = getCanvasPos(e);
            mouseRef.current.x = pos.x;
            mouseRef.current.y = pos.y;
            mouseRef.current.active = true;
        }
        function onMouseLeave() {
            mouseRef.current.active = false;
        }
        function onMouseDown(e: MouseEvent) {
            dragStart = getCanvasPos(e);
            isDragging = false;
        }
        function onMouseMoveDrag(e: MouseEvent) {
            if (dragStart) {
                const pos = getCanvasPos(e);
                const dx = pos.x - dragStart.x,
                    dy = pos.y - dragStart.y;
                if (Math.sqrt(dx * dx + dy * dy) > 5) isDragging = true;
            }
        }
        function onMouseUp(e: MouseEvent) {
            if (!dragStart) return;
            const pos = getCanvasPos(e);
            const r = ballSizeRef.current;
            const dx = dragStart.x - pos.x,
                dy = dragStart.y - pos.y;
            const speed = Math.sqrt(dx * dx + dy * dy) * 0.08;
            const angle = Math.atan2(dy, dx);
            particles.push({
                x: dragStart.x,
                y: dragStart.y,
                vx: isDragging
                    ? Math.cos(angle) * speed
                    : (Math.random() - 0.5) * 3,
                vy: isDragging
                    ? Math.sin(angle) * speed
                    : (Math.random() - 0.5) * 3,
                r,
                mass: r * r,
                trail: [],
                id: nextId++
            });
            dragStart = null;
            isDragging = false;
        }

        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousemove', onMouseMoveDrag);
        canvas.addEventListener('mouseleave', onMouseLeave);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);

        function dimLine(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            label: string
        ) {
            if (!ctx) return;
            const dx = x2 - x1,
                dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 35) return;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = gr(0.2);
            ctx.lineWidth = 0.5;
            ctx.setLineDash([2, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            const nx = -dy / len,
                ny = dx / len;
            ctx.beginPath();
            ctx.moveTo(x1 + nx * 4, y1 + ny * 4);
            ctx.lineTo(x1 - nx * 4, y1 - ny * 4);
            ctx.moveTo(x2 + nx * 4, y2 + ny * 4);
            ctx.lineTo(x2 - nx * 4, y2 - ny * 4);
            ctx.stroke();
            ctx.font = '9px Roboto, sans-serif';
            ctx.fillStyle = gr(0.6);
            ctx.fillText(label, (x1 + x2) / 2 + 4, (y1 + y2) / 2 - 4);
        }

        function draw() {
            if (!ctx) return;
            const w = W(),
                h = H();
            ctx.clearRect(0, 0, w, h);
            frame++;
            const useGravity = gravityRef.current;
            const useAttract = attractRef.current;
            const mouse = mouseRef.current;
            const N = particles.length;

            if (frame % 90 === 0 && N > 0) {
                const idx = Math.floor(Math.random() * N);
                const strength = 2 + Math.random() * 3;
                const ang = Math.random() * Math.PI * 2;
                particles[idx].vx += Math.cos(ang) * strength;
                particles[idx].vy += Math.sin(ang) * strength * 0.7;
            }

            const wind = Math.sin(frame * 0.012) * 0.02;
            totalKE = 0;
            totalPE = 0;
            const groundY = h - 24;

            // Inter-particle gravitational attraction
            if (useAttract) {
                for (let i = 0; i < N; i++) {
                    for (let j = i + 1; j < N; j++) {
                        const a = particles[i],
                            b = particles[j];
                        const dx = b.x - a.x,
                            dy = b.y - a.y;
                        const distSq = dx * dx + dy * dy;
                        const dist = Math.sqrt(distSq) + 1;
                        const minDist = a.r + b.r;
                        if (dist > minDist) {
                            const force =
                                (INTER_G * a.mass * b.mass) / (distSq + 100);
                            const fx = (force * dx) / dist,
                                fy = (force * dy) / dist;
                            a.vx += fx / a.mass;
                            a.vy += fy / a.mass;
                            b.vx -= fx / b.mass;
                            b.vy -= fy / b.mass;
                        }
                    }
                }
            }

            for (const p of particles) {
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > TRAIL_LEN) p.trail.shift();

                if (useGravity) {
                    p.vy += G;
                } else if (mouse.active) {
                    const dx = mouse.x - p.x,
                        dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                    const force = (MOUSE_ATTRACT * p.mass) / (dist * 0.5);
                    const maxF = 1.5;
                    p.vx += (Math.min(maxF, force) * dx) / dist / p.mass;
                    p.vy += (Math.min(maxF, force) * dy) / dist / p.mass;
                    p.vx *= 0.995;
                    p.vy *= 0.995;
                }

                p.vx += wind;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x - p.r < 0) {
                    p.x = p.r;
                    p.vx *= -damping;
                }
                if (p.x + p.r > w) {
                    p.x = w - p.r;
                    p.vx *= -damping;
                }
                if (useGravity) {
                    if (p.y + p.r > groundY) {
                        p.y = groundY - p.r;
                        p.vy *= -damping;
                        p.vx *= 0.99;
                    }
                } else {
                    if (p.y + p.r > h) {
                        p.y = h - p.r;
                        p.vy *= -damping;
                    }
                }
                if (p.y - p.r < 0) {
                    p.y = p.r;
                    p.vy *= -damping;
                }

                totalKE += 0.5 * p.mass * (p.vx * p.vx + p.vy * p.vy);
                totalPE += p.mass * G * Math.max(0, groundY - p.y);
            }

            // Collisions
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const a = particles[i],
                        b = particles[j];
                    const dx = b.x - a.x,
                        dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = a.r + b.r;
                    if (dist < minDist && dist > 0) {
                        collisionCount++;
                        const nx = dx / dist,
                            ny = dy / dist;
                        const relVn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (relVn > 0) {
                            const tm = a.mass + b.mass,
                                imp = (2 * relVn) / tm;
                            a.vx -= imp * b.mass * nx * damping;
                            a.vy -= imp * b.mass * ny * damping;
                            b.vx += imp * a.mass * nx * damping;
                            b.vy += imp * a.mass * ny * damping;
                        }
                        const ov = (minDist - dist) / 2;
                        a.x -= ov * nx;
                        a.y -= ov * ny;
                        b.x += ov * nx;
                        b.y += ov * ny;
                    }
                }
            }

            // ---- RENDER ----

            // Trails
            for (const p of particles) {
                if (p.trail.length < 2) continue;
                for (let i = 1; i < p.trail.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
                    ctx.lineTo(p.trail[i].x, p.trail[i].y);
                    ctx.strokeStyle = o((i / p.trail.length) * 0.45);
                    ctx.lineWidth = 1.5 + (i / p.trail.length) * 1;
                    ctx.stroke();
                }
            }

            // Mouse attractor
            if (!useGravity && mouse.active) {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
                ctx.strokeStyle = o(0.5);
                ctx.lineWidth = 1.2;
                ctx.setLineDash([3, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(mouse.x - 6, mouse.y);
                ctx.lineTo(mouse.x + 6, mouse.y);
                ctx.moveTo(mouse.x, mouse.y - 6);
                ctx.lineTo(mouse.x, mouse.y + 6);
                ctx.strokeStyle = o(0.4);
                ctx.lineWidth = 1;
                ctx.stroke();
                for (const p of particles) {
                    const dist = Math.sqrt(
                        (mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2
                    );
                    if (dist < 250) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = o(0.07);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Slingshot indicator
            if (dragStart && isDragging && mouse.active) {
                const dx = dragStart.x - mouse.x,
                    dy = dragStart.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                const speed = dist * 0.08;
                ctx.beginPath();
                ctx.moveTo(dragStart.x, dragStart.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = o(0.4);
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
                const arrowLen = Math.min(dist * 0.6, 80);
                const ax = dragStart.x + Math.cos(angle) * arrowLen,
                    ay = dragStart.y + Math.sin(angle) * arrowLen;
                ctx.beginPath();
                ctx.moveTo(dragStart.x, dragStart.y);
                ctx.lineTo(ax, ay);
                ctx.strokeStyle = o(0.7);
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.lineTo(
                    ax - 8 * Math.cos(angle - 0.35),
                    ay - 8 * Math.sin(angle - 0.35)
                );
                ctx.moveTo(ax, ay);
                ctx.lineTo(
                    ax - 8 * Math.cos(angle + 0.35),
                    ay - 8 * Math.sin(angle + 0.35)
                );
                ctx.stroke();
                const previewR = ballSizeRef.current;
                ctx.beginPath();
                ctx.arc(dragStart.x, dragStart.y, previewR, 0, Math.PI * 2);
                ctx.strokeStyle = o(0.5);
                ctx.lineWidth = 1.5;
                ctx.setLineDash([3, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.font = '11px Roboto, sans-serif';
                ctx.fillStyle = o(0.85);
                ctx.fillText(
                    `v = ${speed.toFixed(1)}`,
                    dragStart.x + previewR + 8,
                    dragStart.y - 6
                );
                ctx.fillText(
                    `\u03B8 = ${((angle * 180) / Math.PI).toFixed(0)}\u00B0`,
                    dragStart.x + previewR + 8,
                    dragStart.y + 8
                );
            }

            // Dimension lines
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dist = Math.sqrt(
                        (particles[j].x - particles[i].x) ** 2 +
                            (particles[j].y - particles[i].y) ** 2
                    );
                    if (dist < 90)
                        dimLine(
                            particles[i].x,
                            particles[i].y,
                            particles[j].x,
                            particles[j].y,
                            `${dist.toFixed(0)}`
                        );
                }
            }

            // Velocity vectors
            for (const p of particles) {
                const ex = p.x + p.vx * 5,
                    ey = p.y + p.vy * 5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(ex, ey);
                ctx.strokeStyle = o(0.75);
                ctx.lineWidth = 1.2;
                ctx.stroke();
                const angle = Math.atan2(p.vy, p.vx);
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                    ex - 5 * Math.cos(angle - 0.4),
                    ey - 5 * Math.sin(angle - 0.4)
                );
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                    ex - 5 * Math.cos(angle + 0.4),
                    ey - 5 * Math.sin(angle + 0.4)
                );
                ctx.stroke();
            }

            // Particles
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = o(0.18);
                ctx.fill();
                ctx.strokeStyle = o(0.9);
                ctx.lineWidth = 1.8;
                ctx.stroke();
                const cr = p.r + 5;
                ctx.beginPath();
                ctx.moveTo(p.x - cr, p.y);
                ctx.lineTo(p.x - p.r * 0.35, p.y);
                ctx.moveTo(p.x + p.r * 0.35, p.y);
                ctx.lineTo(p.x + cr, p.y);
                ctx.moveTo(p.x, p.y - cr);
                ctx.lineTo(p.x, p.y - p.r * 0.35);
                ctx.moveTo(p.x, p.y + p.r * 0.35);
                ctx.lineTo(p.x, p.y + cr);
                ctx.strokeStyle = o(0.5);
                ctx.lineWidth = 0.8;
                ctx.stroke();
                ctx.font = '10px Roboto, sans-serif';
                ctx.fillStyle = o(0.9);
                ctx.fillText(`P${p.id}`, p.x + cr + 3, p.y - 4);
                ctx.font = '9px Roboto, sans-serif';
                ctx.fillStyle = gr(0.7);
                ctx.fillText(`r=${p.r.toFixed(1)}`, p.x + cr + 3, p.y + 8);
            }

            // Annotations on first 6
            ctx.font = '10px Roboto, sans-serif';
            for (let i = 0; i < Math.min(6, N); i++) {
                const p = particles[i];
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const ke = 0.5 * p.mass * speed * speed;
                const ang = Math.atan2(p.vy, p.vx) * (180 / Math.PI);
                const ox = p.x + p.r + 22,
                    oy = p.y - p.r;
                ctx.fillStyle = o(0.85);
                ctx.fillText(`|v| = ${speed.toFixed(1)}`, ox, oy);
                ctx.fillStyle = gr(0.75);
                ctx.fillText(`\u03B8 = ${ang.toFixed(0)}\u00B0`, ox, oy + 12);
                ctx.fillText(`KE = ${ke.toFixed(0)}`, ox, oy + 24);
            }

            // Ground line
            if (useGravity) {
                ctx.beginPath();
                ctx.moveTo(0, groundY);
                ctx.lineTo(w, groundY);
                ctx.strokeStyle = gr(0.35);
                ctx.lineWidth = 0.6;
                ctx.setLineDash([6, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Update readout element
            const el = document.getElementById('sim-readout');
            if (el) {
                el.textContent = `g = ${useGravity ? G : 0} m/s\u00B2  \u00B7  e = ${damping}  \u00B7  n = ${N}  \u00B7  t = ${(frame / 60).toFixed(1)}s  \u00B7  collisions: ${collisionCount}  \u00B7  \u03A3KE = ${totalKE.toFixed(0)} J  \u00B7  E = ${(totalKE + totalPE).toFixed(0)} J`;
            }

            // Axes (top-left)
            ctx.beginPath();
            ctx.moveTo(16, 50);
            ctx.lineTo(16, 18);
            ctx.moveTo(16, 50);
            ctx.lineTo(48, 50);
            ctx.strokeStyle = gr(0.55);
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(16, 18);
            ctx.lineTo(13, 23);
            ctx.moveTo(16, 18);
            ctx.lineTo(19, 23);
            ctx.moveTo(48, 50);
            ctx.lineTo(43, 47);
            ctx.moveTo(48, 50);
            ctx.lineTo(43, 53);
            ctx.stroke();
            ctx.font = '10px Roboto, sans-serif';
            ctx.fillStyle = gr(0.6);
            ctx.fillText('y', 6, 22);
            ctx.fillText('x', 50, 54);

            // Scale bar (top-right)
            ctx.beginPath();
            ctx.moveTo(w - 62, 18);
            ctx.lineTo(w - 12, 18);
            ctx.moveTo(w - 62, 14);
            ctx.lineTo(w - 62, 22);
            ctx.moveTo(w - 12, 14);
            ctx.lineTo(w - 12, 22);
            ctx.strokeStyle = gr(0.5);
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.fillText('50px', w - 50, 14);

            animationId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousemove', onMouseMoveDrag);
            canvas.removeEventListener('mouseleave', onMouseLeave);
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const btnStyle = (active: boolean) => ({
        padding: '0.35rem 0.7rem',
        background: 'none',
        border: `1.5px solid ${active ? 'hsla(22, 85%, 38%, 1)' : 'hsla(0, 0%, 70%, 1)'}`,
        borderRadius: '2px',
        cursor: 'pointer' as const,
        fontFamily: 'Roboto, sans-serif',
        fontSize: '0.62rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        color: active ? 'hsla(22, 85%, 38%, 1)' : 'hsla(0, 0%, 50%, 1)'
    });

    return (
        <>
            {/* Full-viewport canvas overlay */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'auto',
                    zIndex: 50,
                    cursor: 'crosshair'
                }}
            />

            {/* Content — normal document flow, centered */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 51,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6rem 1rem 4rem'
                }}
            >
                <h1
                    style={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '3.5rem',
                        fontWeight: 700,
                        margin: 0,
                        color: 'hsla(22, 85%, 38%, 1)',
                        borderBottom: 'none'
                    }}
                >
                    404
                </h1>

                <p
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.95rem',
                        color: '#555',
                        margin: '0.25rem 0 0.75rem'
                    }}
                >
                    Page not found.
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.4rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        pointerEvents: 'auto'
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            padding: '0.4rem 1.3rem',
                            background: 'hsla(22, 85%, 38%, 1)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '2px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                        }}
                    >
                        Back to Home
                    </Link>

                    <button
                        onClick={() => setGravityOn((v) => !v)}
                        style={btnStyle(gravityOn)}
                    >
                        {gravityOn ? 'Gravity: ON' : 'Gravity: OFF'}
                    </button>

                    <button
                        onClick={() => setAttractOn((v) => !v)}
                        style={btnStyle(attractOn)}
                    >
                        {attractOn ? 'Attract: ON' : 'Attract: OFF'}
                    </button>

                    <label
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '0.58rem',
                            color: '#888',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            pointerEvents: 'auto'
                        }}
                    >
                        {ballSize}px
                        <input
                            type="range"
                            min="4"
                            max="40"
                            value={ballSize}
                            onChange={(e) =>
                                setBallSize(parseInt(e.target.value))
                            }
                            style={{
                                width: '55px',
                                accentColor: 'hsla(22, 85%, 38%, 1)'
                            }}
                        />
                    </label>
                </div>

                <p
                    id="sim-readout"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.75rem',
                        color: 'hsla(0, 0%, 40%, 0.85)',
                        margin: '0.5rem 0 0',
                        textAlign: 'center',
                        pointerEvents: 'none'
                    }}
                />
            </div>
        </>
    );
}
