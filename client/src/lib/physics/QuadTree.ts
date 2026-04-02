import { Vec2 } from './Vec2';
import { Particle } from './Particle';

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class QuadTree {
    private particles: Particle[] = [];
    private divided = false;
    private nw: QuadTree | null = null;
    private ne: QuadTree | null = null;
    private sw: QuadTree | null = null;
    private se: QuadTree | null = null;

    static MAX_DEPTH = 12;

    constructor(
        public bounds: Rect,
        private depth: number = 0,
        private capacity: number = 4
    ) {}

    insert(p: Particle): boolean {
        if (!this.contains(p.pos)) return false;

        if (
            this.particles.length < this.capacity ||
            this.depth >= QuadTree.MAX_DEPTH
        ) {
            this.particles.push(p);
            return true;
        }

        if (!this.divided) this.subdivide();

        return (
            this.nw!.insert(p) ||
            this.ne!.insert(p) ||
            this.sw!.insert(p) ||
            this.se!.insert(p)
        );
    }

    query(range: Rect, found: Particle[] = []): Particle[] {
        if (!this.intersects(range)) return found;

        for (const p of this.particles) {
            if (
                p.pos.x >= range.x &&
                p.pos.x < range.x + range.w &&
                p.pos.y >= range.y &&
                p.pos.y < range.y + range.h
            ) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.nw!.query(range, found);
            this.ne!.query(range, found);
            this.sw!.query(range, found);
            this.se!.query(range, found);
        }

        return found;
    }

    queryRadius(
        center: Vec2,
        radius: number,
        found: Particle[] = []
    ): Particle[] {
        const range: Rect = {
            x: center.x - radius,
            y: center.y - radius,
            w: radius * 2,
            h: radius * 2
        };

        if (!this.intersects(range)) return found;

        const r2 = radius * radius;
        for (const p of this.particles) {
            if (p.pos.distSqTo(center) <= r2) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.nw!.queryRadius(center, radius, found);
            this.ne!.queryRadius(center, radius, found);
            this.sw!.queryRadius(center, radius, found);
            this.se!.queryRadius(center, radius, found);
        }

        return found;
    }

    detectCollisions(damping: number): number {
        let collisions = 0;
        this.collideInternal(damping, (count) => {
            collisions += count;
        });
        return collisions;
    }

    private collideInternal(
        damping: number,
        onCollision: (count: number) => void
    ): void {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                if (
                    Particle.collide(
                        this.particles[i],
                        this.particles[j],
                        damping
                    )
                ) {
                    onCollision(1);
                }
            }

            if (this.divided) {
                this.checkAgainstChildren(
                    this.particles[i],
                    damping,
                    onCollision
                );
            }
        }

        if (this.divided) {
            this.nw!.collideInternal(damping, onCollision);
            this.ne!.collideInternal(damping, onCollision);
            this.sw!.collideInternal(damping, onCollision);
            this.se!.collideInternal(damping, onCollision);
        }
    }

    private checkAgainstChildren(
        p: Particle,
        damping: number,
        onCollision: (count: number) => void
    ): void {
        const checkNode = (node: QuadTree) => {
            for (const other of node.particles) {
                if (p !== other && Particle.collide(p, other, damping)) {
                    onCollision(1);
                }
            }
            if (node.divided) {
                checkNode(node.nw!);
                checkNode(node.ne!);
                checkNode(node.sw!);
                checkNode(node.se!);
            }
        };

        checkNode(this.nw!);
        checkNode(this.ne!);
        checkNode(this.sw!);
        checkNode(this.se!);
    }

    /** Draw the quadtree — highlights occupied leaf cells */
    draw(
        ctx: CanvasRenderingContext2D,
        gridColor: string,
        fillColor: string
    ): void {
        const hasParticles = this.particles.length > 0;

        // Fill occupied leaf cells
        if (hasParticles && !this.divided) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(
                this.bounds.x,
                this.bounds.y,
                this.bounds.w,
                this.bounds.h
            );
        }

        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.w,
            this.bounds.h
        );

        if (this.divided) {
            this.nw!.draw(ctx, gridColor, fillColor);
            this.ne!.draw(ctx, gridColor, fillColor);
            this.sw!.draw(ctx, gridColor, fillColor);
            this.se!.draw(ctx, gridColor, fillColor);
        }
    }

    private subdivide(): void {
        const { x, y, w, h } = this.bounds;
        const hw = w / 2;
        const hh = h / 2;
        const d = this.depth + 1;

        this.nw = new QuadTree({ x, y, w: hw, h: hh }, d, this.capacity);
        this.ne = new QuadTree(
            { x: x + hw, y, w: hw, h: hh },
            d,
            this.capacity
        );
        this.sw = new QuadTree(
            { x, y: y + hh, w: hw, h: hh },
            d,
            this.capacity
        );
        this.se = new QuadTree(
            { x: x + hw, y: y + hh, w: hw, h: hh },
            d,
            this.capacity
        );

        this.divided = true;
    }

    private contains(point: Vec2): boolean {
        return (
            point.x >= this.bounds.x &&
            point.x < this.bounds.x + this.bounds.w &&
            point.y >= this.bounds.y &&
            point.y < this.bounds.y + this.bounds.h
        );
    }

    private intersects(range: Rect): boolean {
        return !(
            range.x > this.bounds.x + this.bounds.w ||
            range.x + range.w < this.bounds.x ||
            range.y > this.bounds.y + this.bounds.h ||
            range.y + range.h < this.bounds.y
        );
    }
}
