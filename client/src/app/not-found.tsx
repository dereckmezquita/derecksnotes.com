'use client';
import { useEffect, useRef } from 'react';
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
    charge: number; // for coloring
}

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const g = 0.08;
        const damping = 0.85;
        const orange = 'hsla(22, 80%, 50%, ';
        const grey = 'hsla(0, 0%, 60%, ';
        const TRAIL_LEN = 120;
        const N = 12;

        const particles: Particle[] = [];
        for (let i = 0; i < N; i++) {
            const r = 3 + Math.random() * 10;
            particles.push({
                x: 40 + Math.random() * (W() - 80),
                y: 30 + Math.random() * (H() * 0.6),
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 3,
                r,
                mass: r * r,
                trail: [],
                id: i,
                charge: Math.random() > 0.5 ? 1 : -1
            });
        }

        let frame = 0;
        let totalKE = 0;
        let totalPE = 0;
        let collisionCount = 0;

        function applyRandomForce() {
            // Periodic perturbation — like a shaker table
            const strength = 2 + Math.random() * 3;
            const idx = Math.floor(Math.random() * particles.length);
            const angle = Math.random() * Math.PI * 2;
            particles[idx].vx += Math.cos(angle) * strength;
            particles[idx].vy += Math.sin(angle) * strength * 0.6;
        }

        // Dimension lines helper
        function drawDimLine(
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
            if (len < 20) return;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `${grey}0.25)`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([2, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Tick marks at endpoints
            const nx = -dy / len;
            const ny = dx / len;
            const tick = 3;
            ctx.beginPath();
            ctx.moveTo(x1 + nx * tick, y1 + ny * tick);
            ctx.lineTo(x1 - nx * tick, y1 - ny * tick);
            ctx.moveTo(x2 + nx * tick, y2 + ny * tick);
            ctx.lineTo(x2 - nx * tick, y2 - ny * tick);
            ctx.stroke();

            // Label at midpoint
            ctx.font = '8px Roboto, sans-serif';
            ctx.fillStyle = `${grey}0.4)`;
            ctx.fillText(label, (x1 + x2) / 2 + 3, (y1 + y2) / 2 - 3);
        }

        function draw() {
            if (!ctx || !canvas) return;
            const w = W();
            const h = H();
            ctx.clearRect(0, 0, w, h);
            frame++;

            // Perturbation every ~90 frames
            if (frame % 90 === 0) applyRandomForce();

            // Wind force — gentle sinusoidal
            const wind = Math.sin(frame * 0.015) * 0.04;

            totalKE = 0;
            totalPE = 0;

            // Physics update
            for (const p of particles) {
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > TRAIL_LEN) p.trail.shift();

                p.vy += g;
                p.vx += wind;

                p.x += p.vx;
                p.y += p.vy;

                const groundY = h - 20;
                if (p.x - p.r < 0) {
                    p.x = p.r;
                    p.vx *= -damping;
                }
                if (p.x + p.r > w) {
                    p.x = w - p.r;
                    p.vx *= -damping;
                }
                if (p.y + p.r > groundY) {
                    p.y = groundY - p.r;
                    p.vy *= -damping;
                    p.vx *= 0.99;
                }
                if (p.y - p.r < 0) {
                    p.y = p.r;
                    p.vy *= -damping;
                }

                const speed2 = p.vx * p.vx + p.vy * p.vy;
                totalKE += 0.5 * p.mass * speed2;
                totalPE += p.mass * g * (groundY - p.y);
            }

            // Collisions
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
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
                            const totalMass = a.mass + b.mass;
                            const impulse = (2 * relVn) / totalMass;
                            a.vx -= impulse * b.mass * nx * damping;
                            a.vy -= impulse * b.mass * ny * damping;
                            b.vx += impulse * a.mass * nx * damping;
                            b.vy += impulse * a.mass * ny * damping;
                        }

                        const overlap = (minDist - dist) / 2;
                        a.x -= overlap * nx;
                        a.y -= overlap * ny;
                        b.x += overlap * nx;
                        b.y += overlap * ny;
                    }
                }
            }

            // ---- DRAWING ----

            // Trails with fading
            for (const p of particles) {
                if (p.trail.length < 2) continue;
                for (let i = 1; i < p.trail.length; i++) {
                    const alpha = (i / p.trail.length) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
                    ctx.lineTo(p.trail[i].x, p.trail[i].y);
                    ctx.strokeStyle = `${orange}${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Dimension lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        drawDimLine(a.x, a.y, b.x, b.y, `${dist.toFixed(0)}px`);
                    }
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
                ctx.strokeStyle = `${orange}0.35)`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // Arrowhead
                const angle = Math.atan2(p.vy, p.vx);
                const headLen = 4;
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                    ex - headLen * Math.cos(angle - 0.4),
                    ey - headLen * Math.sin(angle - 0.4)
                );
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                    ex - headLen * Math.cos(angle + 0.4),
                    ey - headLen * Math.sin(angle + 0.4)
                );
                ctx.stroke();
            }

            // Particles
            for (const p of particles) {
                // Outer circle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `${orange}0.06)`;
                ctx.fill();
                ctx.strokeStyle = `${orange}0.5)`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Crosshair
                const cr = p.r + 3;
                ctx.beginPath();
                ctx.moveTo(p.x - cr, p.y);
                ctx.lineTo(p.x - p.r * 0.3, p.y);
                ctx.moveTo(p.x + p.r * 0.3, p.y);
                ctx.lineTo(p.x + cr, p.y);
                ctx.moveTo(p.x, p.y - cr);
                ctx.lineTo(p.x, p.y - p.r * 0.3);
                ctx.moveTo(p.x, p.y + p.r * 0.3);
                ctx.lineTo(p.x, p.y + cr);
                ctx.strokeStyle = `${orange}0.25)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // ID label
                ctx.font = '7px Roboto, sans-serif';
                ctx.fillStyle = `${orange}0.5)`;
                ctx.fillText(`P${p.id}`, p.x + cr + 2, p.y - 2);
            }

            // Annotate a few particles with live data
            ctx.font = '9px Roboto, sans-serif';

            for (let i = 0; i < Math.min(4, particles.length); i++) {
                const p = particles[i];
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const ke = 0.5 * p.mass * speed * speed;
                const angle = Math.atan2(p.vy, p.vx) * (180 / Math.PI);
                const ox = p.x + p.r + 14;
                const oy = p.y - p.r - 2;

                ctx.fillStyle = `${orange}0.35)`;
                ctx.fillText(`|v| = ${speed.toFixed(1)}`, ox, oy);
                ctx.fillText(`θ = ${angle.toFixed(0)}°`, ox, oy + 10);
                ctx.fillText(`KE = ${ke.toFixed(0)}`, ox, oy + 20);
            }

            // Ground line
            ctx.beginPath();
            ctx.moveTo(0, h - 20);
            ctx.lineTo(w, h - 20);
            ctx.strokeStyle = `${grey}0.3)`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // System readout panel — bottom
            ctx.font = '8px Roboto, sans-serif';
            ctx.fillStyle = `${grey}0.5)`;
            const readoutY = h - 8;
            ctx.fillText(`g = ${g} m/s²`, 8, readoutY);
            ctx.fillText(`e = ${damping}`, 80, readoutY);
            ctx.fillText(`n = ${N}`, 130, readoutY);
            ctx.fillText(`ΣKE = ${totalKE.toFixed(0)} J`, 170, readoutY);
            ctx.fillText(`ΣPE = ${totalPE.toFixed(0)} J`, 250, readoutY);
            ctx.fillText(
                `E = ${(totalKE + totalPE).toFixed(0)} J`,
                330,
                readoutY
            );
            ctx.fillText(`collisions: ${collisionCount}`, 410, readoutY);
            ctx.fillText(`t = ${(frame / 60).toFixed(1)}s`, w - 55, readoutY);

            // Coordinate axes indicator (top-left)
            const axisX = 16;
            const axisY = 20;
            const axisLen = 25;
            ctx.beginPath();
            ctx.moveTo(axisX, axisY + axisLen);
            ctx.lineTo(axisX, axisY);
            ctx.moveTo(axisX, axisY + axisLen);
            ctx.lineTo(axisX + axisLen, axisY + axisLen);
            ctx.strokeStyle = `${grey}0.35)`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            // Arrowheads
            ctx.beginPath();
            ctx.moveTo(axisX, axisY);
            ctx.lineTo(axisX - 3, axisY + 5);
            ctx.moveTo(axisX, axisY);
            ctx.lineTo(axisX + 3, axisY + 5);
            ctx.moveTo(axisX + axisLen, axisY + axisLen);
            ctx.lineTo(axisX + axisLen - 5, axisY + axisLen - 3);
            ctx.moveTo(axisX + axisLen, axisY + axisLen);
            ctx.lineTo(axisX + axisLen - 5, axisY + axisLen + 3);
            ctx.stroke();
            ctx.font = '8px Roboto, sans-serif';
            ctx.fillStyle = `${grey}0.4)`;
            ctx.fillText('y', axisX - 8, axisY + 4);
            ctx.fillText('x', axisX + axisLen + 3, axisY + axisLen + 3);

            // Scale bar (top-right)
            const scaleW = 50;
            const scaleY2 = 18;
            ctx.beginPath();
            ctx.moveTo(w - scaleW - 10, scaleY2);
            ctx.lineTo(w - 10, scaleY2);
            ctx.strokeStyle = `${grey}0.35)`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            // Ticks
            ctx.beginPath();
            ctx.moveTo(w - scaleW - 10, scaleY2 - 3);
            ctx.lineTo(w - scaleW - 10, scaleY2 + 3);
            ctx.moveTo(w - 10, scaleY2 - 3);
            ctx.lineTo(w - 10, scaleY2 + 3);
            ctx.stroke();
            ctx.fillText(`${scaleW}px`, w - scaleW / 2 - 20, scaleY2 - 6);

            animationId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
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
                    maxHeight: '500px'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />
            </div>

            <h1
                style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    margin: '0.5rem 0 0',
                    color: 'hsla(22, 80%, 50%, 1)',
                    borderBottom: 'none'
                }}
            >
                404
            </h1>

            <p
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '0.9rem',
                    color: '#999',
                    margin: '0.3rem 0 1.2rem'
                }}
            >
                Page not found.
            </p>

            <Link
                href="/"
                style={{
                    display: 'inline-block',
                    padding: '0.45rem 1.4rem',
                    background: 'hsla(22, 80%, 50%, 1)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '2px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                }}
            >
                Back to Home
            </Link>
        </div>
    );
}
