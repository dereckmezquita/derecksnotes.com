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

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gravityOn, setGravityOn] = useState(true);
    const gravityRef = useRef(true);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });

    useEffect(() => {
        gravityRef.current = gravityOn;
    }, [gravityOn]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const dpr = window.devicePixelRatio || 1;

        function resize() {
            if (!canvas) return;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resize();
        window.addEventListener('resize', resize);

        const W = () => canvas!.offsetWidth;
        const H = () => canvas!.offsetHeight;

        const G = 0.1;
        const damping = 0.85;
        const MOUSE_ATTRACT = 0.4;
        const TRAIL_LEN = 100;
        const N = 12;

        // Colors — solid, readable
        const o = (a: number) => `hsla(22, 80%, 42%, ${a})`;
        const gr = (a: number) => `hsla(0, 0%, 35%, ${a})`;

        const particles: Particle[] = [];
        for (let i = 0; i < N; i++) {
            const r = 6 + Math.random() * 14;
            particles.push({
                x: 50 + Math.random() * (W() - 100),
                y: 30 + Math.random() * (H() * 0.5),
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 3,
                r,
                mass: r * r,
                trail: [],
                id: i
            });
        }

        let frame = 0;
        let totalKE = 0;
        let totalPE = 0;
        let collisionCount = 0;

        function onMouseMove(e: MouseEvent) {
            const rect = canvas!.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        }
        function onMouseLeave() {
            mouseRef.current.active = false;
        }
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);

        function dimLine(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            label: string
        ) {
            if (!ctx) return;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 30) return;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = gr(0.25);
            ctx.lineWidth = 0.5;
            ctx.setLineDash([2, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            const nx = -dy / len;
            const ny = dx / len;
            ctx.beginPath();
            ctx.moveTo(x1 + nx * 4, y1 + ny * 4);
            ctx.lineTo(x1 - nx * 4, y1 - ny * 4);
            ctx.moveTo(x2 + nx * 4, y2 + ny * 4);
            ctx.lineTo(x2 - nx * 4, y2 - ny * 4);
            ctx.stroke();

            ctx.font = '9px Roboto, sans-serif';
            ctx.fillStyle = gr(0.55);
            ctx.fillText(label, (x1 + x2) / 2 + 4, (y1 + y2) / 2 - 4);
        }

        function draw() {
            if (!ctx || !canvas) return;
            const w = W();
            const h = H();
            ctx.clearRect(0, 0, w, h);
            frame++;

            const useGravity = gravityRef.current;
            const mouse = mouseRef.current;

            // Random perturbation
            if (frame % 80 === 0) {
                const idx = Math.floor(Math.random() * N);
                const strength = 2.5 + Math.random() * 3;
                const ang = Math.random() * Math.PI * 2;
                particles[idx].vx += Math.cos(ang) * strength;
                particles[idx].vy += Math.sin(ang) * strength * 0.7;
            }

            const wind = Math.sin(frame * 0.012) * 0.03;
            totalKE = 0;
            totalPE = 0;
            const groundY = h - 24;

            for (const p of particles) {
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > TRAIL_LEN) p.trail.shift();

                if (useGravity) {
                    p.vy += G;
                } else if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                    const force = (MOUSE_ATTRACT * p.mass) / (dist * 0.5);
                    const maxF = 1.5;
                    p.vx += (Math.min(maxF, force) * (dx / dist)) / p.mass;
                    p.vy += (Math.min(maxF, force) * (dy / dist)) / p.mass;
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

                const speed2 = p.vx * p.vx + p.vy * p.vy;
                totalKE += 0.5 * p.mass * speed2;
                totalPE += p.mass * G * Math.max(0, groundY - p.y);
            }

            // Collisions
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = a.r + b.r;
                    if (dist < minDist && dist > 0) {
                        collisionCount++;
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const relVn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (relVn > 0) {
                            const tm = a.mass + b.mass;
                            const imp = (2 * relVn) / tm;
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
                    const alpha = (i / p.trail.length) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
                    ctx.lineTo(p.trail[i].x, p.trail[i].y);
                    ctx.strokeStyle = o(alpha);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Mouse attractor
            if (!useGravity && mouse.active) {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
                ctx.strokeStyle = o(0.4);
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(mouse.x - 5, mouse.y);
                ctx.lineTo(mouse.x + 5, mouse.y);
                ctx.moveTo(mouse.x, mouse.y - 5);
                ctx.lineTo(mouse.x, mouse.y + 5);
                ctx.strokeStyle = o(0.3);
                ctx.lineWidth = 0.8;
                ctx.stroke();
                for (const p of particles) {
                    const dist = Math.sqrt(
                        (mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2
                    );
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = o(0.08);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Dimension lines
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dist = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
                    if (dist < 100)
                        dimLine(a.x, a.y, b.x, b.y, `${dist.toFixed(0)}`);
                }
            }

            // Velocity vectors
            for (const p of particles) {
                const scale = 5;
                const ex = p.x + p.vx * scale;
                const ey = p.y + p.vy * scale;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(ex, ey);
                ctx.strokeStyle = o(0.65);
                ctx.lineWidth = 1;
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
                ctx.fillStyle = o(0.15);
                ctx.fill();
                ctx.strokeStyle = o(0.8);
                ctx.lineWidth = 1.5;
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
                ctx.strokeStyle = o(0.45);
                ctx.lineWidth = 0.7;
                ctx.stroke();

                // Radius indicator arc
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, -0.15, 0.2);
                ctx.strokeStyle = o(0.3);
                ctx.lineWidth = 0.5;
                ctx.setLineDash([1, 2]);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.font = '9px Roboto, sans-serif';
                ctx.fillStyle = o(0.85);
                ctx.fillText(`P${p.id}`, p.x + cr + 3, p.y - 4);
                ctx.font = '8px Roboto, sans-serif';
                ctx.fillStyle = gr(0.6);
                ctx.fillText(`r=${p.r.toFixed(1)}`, p.x + cr + 3, p.y + 7);
            }

            // Annotations on first 5
            ctx.font = '10px Roboto, sans-serif';
            for (let i = 0; i < Math.min(5, N); i++) {
                const p = particles[i];
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const ke = 0.5 * p.mass * speed * speed;
                const ang = Math.atan2(p.vy, p.vx) * (180 / Math.PI);
                const ox = p.x + p.r + 22;
                const oy = p.y - p.r - 2;

                ctx.fillStyle = o(0.75);
                ctx.fillText(`|v| = ${speed.toFixed(1)}`, ox, oy);
                ctx.fillStyle = gr(0.65);
                ctx.fillText(`θ = ${ang.toFixed(0)}°`, ox, oy + 12);
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

            // System readout
            ctx.font = '10px Roboto, sans-serif';
            ctx.fillStyle = gr(0.7);
            const ry = h - 7;
            ctx.fillText(`g = ${useGravity ? G : 0} m/s²`, 8, ry);
            ctx.fillText(`e = ${damping}`, 100, ry);
            ctx.fillText(`n = ${N}`, 155, ry);
            ctx.fillText(`ΣKE = ${totalKE.toFixed(0)} J`, 195, ry);
            ctx.fillText(`ΣPE = ${totalPE.toFixed(0)} J`, 290, ry);
            ctx.fillText(`E = ${(totalKE + totalPE).toFixed(0)} J`, 385, ry);
            ctx.fillText(`collisions: ${collisionCount}`, 470, ry);
            ctx.fillText(`t = ${(frame / 60).toFixed(1)}s`, w - 65, ry);
            if (!useGravity) {
                ctx.fillStyle = o(0.7);
                ctx.font = '10px Roboto, sans-serif';
                ctx.fillText('ZERO-G · MOUSE ATTRACTOR', w / 2 - 80, ry);
            }

            // Axes
            const ax = 16,
                ay = 18,
                al = 30;
            ctx.beginPath();
            ctx.moveTo(ax, ay + al);
            ctx.lineTo(ax, ay);
            ctx.moveTo(ax, ay + al);
            ctx.lineTo(ax + al, ay + al);
            ctx.strokeStyle = gr(0.5);
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax - 3, ay + 5);
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax + 3, ay + 5);
            ctx.moveTo(ax + al, ay + al);
            ctx.lineTo(ax + al - 5, ay + al - 3);
            ctx.moveTo(ax + al, ay + al);
            ctx.lineTo(ax + al - 5, ay + al + 3);
            ctx.stroke();
            ctx.font = '10px Roboto, sans-serif';
            ctx.fillStyle = gr(0.55);
            ctx.fillText('y', ax - 10, ay + 5);
            ctx.fillText('x', ax + al + 3, ay + al + 5);

            // Scale bar
            const sw = 50,
                sy = 18;
            ctx.beginPath();
            ctx.moveTo(w - sw - 12, sy);
            ctx.lineTo(w - 12, sy);
            ctx.moveTo(w - sw - 12, sy - 4);
            ctx.lineTo(w - sw - 12, sy + 4);
            ctx.moveTo(w - 12, sy - 4);
            ctx.lineTo(w - 12, sy + 4);
            ctx.strokeStyle = gr(0.45);
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.fillStyle = gr(0.55);
            ctx.fillText(`${sw}px`, w - sw / 2 - 22, sy - 6);

            animationId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <div
            style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 1rem',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '55vh',
                    minHeight: '350px',
                    maxHeight: '520px',
                    cursor: gravityOn ? 'default' : 'crosshair'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    margin: '0.5rem 0'
                }}
            >
                <h1
                    style={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 700,
                        margin: 0,
                        color: 'hsla(22, 80%, 42%, 1)',
                        borderBottom: 'none'
                    }}
                >
                    404
                </h1>

                <button
                    onClick={() => setGravityOn((v) => !v)}
                    style={{
                        padding: '0.35rem 0.9rem',
                        background: 'none',
                        border: `1px solid ${gravityOn ? 'hsla(0, 0%, 70%, 1)' : 'hsla(22, 80%, 42%, 1)'}`,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: gravityOn
                            ? 'hsla(0, 0%, 50%, 1)'
                            : 'hsla(22, 80%, 42%, 1)'
                    }}
                >
                    {gravityOn ? 'Gravity: ON' : 'Gravity: OFF'}
                </button>
            </div>

            <p
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '1rem',
                    color: '#666',
                    margin: '0.3rem 0 1.2rem'
                }}
            >
                Page not found.
                {!gravityOn ? ' Move your mouse over the simulation.' : ''}
            </p>

            <Link
                href="/"
                style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.6rem',
                    background: 'hsla(22, 80%, 42%, 1)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '2px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                }}
            >
                Back to Home
            </Link>
        </div>
    );
}
