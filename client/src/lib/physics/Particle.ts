import { Vec2 } from './Vec2';

export interface ParticleConfig {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
}

export class Particle {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    mass: number;
    trail: Vec2[];

    private static readonly MAX_TRAIL = 80;

    constructor(config: ParticleConfig) {
        this.id = config.id;
        this.pos = config.pos;
        this.vel = config.vel;
        this.radius = config.radius;
        this.mass = config.radius * config.radius;
        this.trail = [];
    }

    update(): void {
        this.trail.push(this.pos.clone());
        if (this.trail.length > Particle.MAX_TRAIL) this.trail.shift();
        this.pos.addMut(this.vel);
    }

    applyForce(force: Vec2): void {
        this.vel.addMut(force.div(this.mass));
    }

    applyImpulse(impulse: Vec2): void {
        this.vel.addMut(impulse);
    }

    kineticEnergy(): number {
        return 0.5 * this.mass * this.vel.lengthSq();
    }

    speed(): number {
        return this.vel.length();
    }

    bounceWalls(
        width: number,
        height: number,
        damping: number,
        groundY?: number
    ): void {
        if (this.pos.x - this.radius < 0) {
            this.pos.x = this.radius;
            this.vel.x *= -damping;
        }
        if (this.pos.x + this.radius > width) {
            this.pos.x = width - this.radius;
            this.vel.x *= -damping;
        }
        if (this.pos.y - this.radius < 0) {
            this.pos.y = this.radius;
            this.vel.y *= -damping;
        }

        const floor = groundY ?? height;
        if (this.pos.y + this.radius > floor) {
            this.pos.y = floor - this.radius;
            this.vel.y *= -damping;
            this.vel.x *= 0.99;
        }
    }

    static collide(a: Particle, b: Particle, damping: number): boolean {
        const delta = b.pos.sub(a.pos);
        const dist = delta.length();
        const minDist = a.radius + b.radius;

        if (dist >= minDist || dist === 0) return false;

        const normal = delta.div(dist);
        const relVel = a.vel.sub(b.vel);
        const relVn = relVel.dot(normal);

        if (relVn > 0) {
            const totalMass = a.mass + b.mass;
            const impulse = (2 * relVn) / totalMass;

            a.vel.subMut(normal.mul(impulse * b.mass * damping));
            b.vel.addMut(normal.mul(impulse * a.mass * damping));
        }

        // Separate overlapping particles
        const overlap = (minDist - dist) / 2;
        a.pos.subMut(normal.mul(overlap));
        b.pos.addMut(normal.mul(overlap));

        return true;
    }

    static attract(a: Particle, b: Particle, G: number): void {
        const delta = b.pos.sub(a.pos);
        const distSq = delta.lengthSq();
        const dist = Math.sqrt(distSq) + 1;
        const minDist = a.radius + b.radius;

        if (dist <= minDist) return;

        const force = (G * a.mass * b.mass) / (distSq + 100);
        const forceVec = delta.div(dist).mul(force);

        a.vel.addMut(forceVec.div(a.mass));
        b.vel.subMut(forceVec.div(b.mass));
    }
}
