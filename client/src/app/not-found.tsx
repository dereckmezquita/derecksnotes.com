'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Vec2, Particle, QuadTree, Renderer } from '@/lib/physics';

let nextId = 0;

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gravityOn, setGravityOn] = useState(false);
    const [attractOn, setAttractOn] = useState(false);
    const [ballSize, setBallSize] = useState(12);
    const [qtCapacity, setQtCapacity] = useState(4);
    const [spawnCount, setSpawnCount] = useState(1);
    const gravityRef = useRef(false);
    const attractRef = useRef(false);
    const ballSizeRef = useRef(12);
    const qtCapacityRef = useRef(4);
    const spawnCountRef = useRef(1);
    const mouseRef = useRef({ pos: new Vec2(-1000, -1000), active: false });
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
        qtCapacityRef.current = qtCapacity;
    }, [qtCapacity]);
    useEffect(() => {
        spawnCountRef.current = spawnCount;
    }, [spawnCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const dpr = window.devicePixelRatio || 1;
        const renderer = new Renderer(ctx);

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

        // Physics constants
        const GRAVITY = 0.1;
        const INTER_G = 0.3;
        const DAMPING = 0.85;
        const MOUSE_ATTRACT = 0.4;
        const INITIAL_COUNT = 14;

        const particles = particlesRef.current;
        if (particles.length === 0) {
            for (let i = 0; i < INITIAL_COUNT; i++) {
                const r = 6 + Math.random() * 16;
                particles.push(
                    new Particle({
                        id: nextId++,
                        pos: Vec2.from(
                            50 + Math.random() * (W() - 100),
                            30 + Math.random() * (H() * 0.6)
                        ),
                        vel: Vec2.from(
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 4
                        ),
                        radius: r
                    })
                );
            }
        }

        let frame = 0;
        let collisionCount = 0;
        let dragStart: Vec2 | null = null;
        let isDragging = false;

        // Input handlers
        function onMouseMove(e: MouseEvent) {
            mouseRef.current.pos.set(e.clientX, e.clientY);
            mouseRef.current.active = true;
        }
        function onMouseLeave() {
            mouseRef.current.active = false;
        }
        function onMouseDown(e: MouseEvent) {
            dragStart = Vec2.from(e.clientX, e.clientY);
            isDragging = false;
        }
        function onMouseMoveDrag(e: MouseEvent) {
            if (
                dragStart &&
                Vec2.from(e.clientX, e.clientY).distTo(dragStart) > 5
            ) {
                isDragging = true;
            }
        }
        function onMouseUp(e: MouseEvent) {
            if (!dragStart) return;
            const r = ballSizeRef.current;
            const count = spawnCountRef.current;
            const endPos = Vec2.from(e.clientX, e.clientY);
            const launch = dragStart.sub(endPos);
            const speed = launch.length() * 0.08;
            const angle = launch.angle();

            for (let i = 0; i < count; i++) {
                const spread = count > 1 ? (Math.random() - 0.5) * 0.3 : 0;
                const sizeVariation =
                    count > 1 ? r * (0.7 + Math.random() * 0.6) : r;
                particles.push(
                    new Particle({
                        id: nextId++,
                        pos: dragStart.add(Vec2.random(count > 1 ? 10 : 0)),
                        vel: isDragging
                            ? Vec2.fromAngle(
                                  angle + spread,
                                  speed * (0.8 + Math.random() * 0.4)
                              )
                            : Vec2.random(1.5),
                        radius: sizeVariation
                    })
                );
            }

            dragStart = null;
            isDragging = false;
        }

        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousemove', onMouseMoveDrag);
        canvas.addEventListener('mouseleave', onMouseLeave);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);

        function draw() {
            if (!ctx) return;
            const w = W(),
                h = H();
            renderer.clear(w, h);
            frame++;

            const useGravity = gravityRef.current;
            const useAttract = attractRef.current;
            const mouse = mouseRef.current;
            const N = particles.length;
            const groundY = h - 24;
            const wind = Vec2.from(Math.sin(frame * 0.012) * 0.02, 0);

            // Random perturbation
            if (frame % 90 === 0 && N > 0) {
                const idx = Math.floor(Math.random() * N);
                particles[idx].applyImpulse(Vec2.random(2 + Math.random() * 3));
            }

            // Build quadtree
            const qt = new QuadTree(
                { x: 0, y: 0, w, h },
                0,
                qtCapacityRef.current
            );
            for (const p of particles) qt.insert(p);

            // Inter-particle gravity (use quadtree for range query)
            if (useAttract) {
                for (const p of particles) {
                    const nearby = qt.queryRadius(p.pos, 300);
                    for (const other of nearby) {
                        if (other.id > p.id) {
                            Particle.attract(p, other, INTER_G);
                        }
                    }
                }
            }

            // Update particles
            let totalKE = 0;
            let totalPE = 0;

            for (const p of particles) {
                if (useGravity) {
                    p.vel.y += GRAVITY;
                } else if (mouse.active) {
                    const delta = mouse.pos.sub(p.pos);
                    const dist = delta.length() + 1;
                    const force = Math.min(
                        1.5,
                        (MOUSE_ATTRACT * p.mass) / (dist * 0.5)
                    );
                    p.applyForce(delta.normalize().mul(force));
                    p.vel.mulMut(0.995);
                }

                p.vel.addMut(wind);
                p.update();
                p.bounceWalls(w, h, DAMPING, useGravity ? groundY : undefined);

                totalKE += p.kineticEnergy();
                totalPE += p.mass * GRAVITY * Math.max(0, groundY - p.pos.y);
            }

            // Collision detection via quadtree
            collisionCount += qt.detectCollisions(DAMPING);

            // ---- RENDER (back to front) ----

            // QuadTree grid — behind everything
            renderer.drawQuadTree(qt);

            renderer.drawTrails(particles);
            renderer.drawDimLines(particles, 90);
            renderer.drawVelocityVectors(particles);

            // Mouse attractor visualization
            if (!useGravity && mouse.active) {
                renderer.drawMouseAttractor(mouse.pos, particles, 250);
            }

            // Slingshot preview
            if (dragStart && isDragging && mouse.active) {
                renderer.drawSlingshot(
                    dragStart,
                    mouse.pos,
                    ballSizeRef.current
                );
            }

            // Particles on top
            renderer.drawParticles(particles);
            renderer.drawAnnotations(particles, 6);

            if (useGravity) renderer.drawGroundLine(groundY, w);

            renderer.drawAxes();
            renderer.drawScaleBar(w);

            // Update readout
            const el = document.getElementById('sim-readout');
            if (el) {
                el.textContent = `g = ${useGravity ? GRAVITY : 0} m/s\u00B2  \u00B7  e = ${DAMPING}  \u00B7  n = ${N}  \u00B7  t = ${(frame / 60).toFixed(1)}s  \u00B7  collisions: ${collisionCount}  \u00B7  \u03A3KE = ${totalKE.toFixed(0)} J  \u00B7  E = ${(totalKE + totalPE).toFixed(0)} J`;
            }

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

    const btnClass = (active: boolean) =>
        `sim-btn ${active ? 'sim-btn-active' : ''}`;

    return (
        <>
            <style>{`
                .sim-btn {
                    padding: 0.35rem 0.7rem;
                    background: none;
                    border: 1.5px solid hsla(0, 0%, 70%, 1);
                    border-radius: 2px;
                    cursor: pointer;
                    font-family: Roboto, sans-serif;
                    font-size: 0.62rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: hsla(0, 0%, 50%, 1);
                    transition: all 0.15s ease;
                }
                .sim-btn:hover {
                    background: hsla(22, 85%, 38%, 0.08);
                    border-color: hsla(22, 85%, 38%, 0.6);
                    color: hsla(22, 85%, 38%, 1);
                }
                .sim-btn-active {
                    border-color: hsla(22, 85%, 38%, 1);
                    color: hsla(22, 85%, 38%, 1);
                    background: hsla(22, 85%, 38%, 0.06);
                }
                .sim-btn-active:hover {
                    background: hsla(22, 85%, 38%, 0.15);
                }
            `}</style>
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
                        className={btnClass(gravityOn)}
                    >
                        {gravityOn ? 'Gravity: ON' : 'Gravity: OFF'}
                    </button>

                    <button
                        onClick={() => setAttractOn((v) => !v)}
                        className={btnClass(attractOn)}
                    >
                        {attractOn ? 'Attract: ON' : 'Attract: OFF'}
                    </button>

                    {(['Size', 'Grid', 'Spawn'] as const).map((label) => {
                        const configs = {
                            Size: {
                                value: ballSize,
                                set: setBallSize,
                                min: 4,
                                max: 40,
                                suffix: 'px'
                            },
                            Grid: {
                                value: qtCapacity,
                                set: setQtCapacity,
                                min: 1,
                                max: 16,
                                suffix: ''
                            },
                            Spawn: {
                                value: spawnCount,
                                set: setSpawnCount,
                                min: 1,
                                max: 50,
                                suffix: ''
                            }
                        };
                        const c = configs[label];
                        return (
                            <label
                                key={label}
                                style={{
                                    fontFamily: 'Roboto, sans-serif',
                                    fontSize: '0.58rem',
                                    color: '#888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    pointerEvents: 'auto'
                                }}
                            >
                                {label}:{c.value}
                                {c.suffix}
                                <input
                                    type="range"
                                    min={c.min}
                                    max={c.max}
                                    value={c.value}
                                    onChange={(e) =>
                                        c.set(parseInt(e.target.value))
                                    }
                                    style={{
                                        width: '45px',
                                        accentColor: 'hsla(22, 85%, 38%, 1)'
                                    }}
                                />
                            </label>
                        );
                    })}
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
