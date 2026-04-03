import { Vec2 } from './Vec2';

export interface ParticleConfig {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
}

// Black hole forms when mass exceeds this
export const BLACK_HOLE_MASS_THRESHOLD = 100000;
export const MERGE_SPEED_THRESHOLD = 15;
export const COMPRESSION_OVERLAP_THRESHOLD = 8;

export class Particle {
    id: number;
    pos: Vec2; // position — still a Vec2 for convenience in non-hot paths (rendering, spawning)
    vel: Vec2; // velocity — same, Vec2 for API but accessed as .x/.y in hot paths
    radius: number;
    mass: number;
    isBlackHole: boolean = false;
    overlapCount: number = 0;
    age: number = 0;
    contactFrames: Map<number, number> = new Map();
    static readonly MERGE_COOLDOWN = 300;
    static readonly BH_ABSORB_CONTACT_FRAMES = 5;
    trail: Vec2[];

    private static readonly MAX_TRAIL = 80;

    blackHoleAge: number = 0;
    static readonly BLACK_HOLE_LIFETIME = 1800;
    static readonly BLACK_HOLE_RADIUS = 5;

    constructor(config: ParticleConfig) {
        this.id = config.id;
        this.pos = config.pos;
        this.vel = config.vel;
        this.radius = config.radius;
        this.mass = config.radius * config.radius;
        this.trail = [];
    }

    // ---- Hot path methods: all use inline x,y math, zero allocations ----

    update(): void {
        // Trail push — still creates a Vec2 for storage, but this is O(1) per frame
        this.trail.push(new Vec2(this.pos.x, this.pos.y));
        if (this.trail.length > Particle.MAX_TRAIL) this.trail.shift();

        // Position += velocity (inline, no Vec2 allocation)
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.age++;
    }

    canMerge(): boolean {
        return this.age > Particle.MERGE_COOLDOWN;
    }

    // Apply force as (fx, fy) — inline version, no Vec2 created
    // Equivalent to: vel += force / mass
    applyForceXY(fx: number, fy: number): void {
        this.vel.x += fx / this.mass;
        this.vel.y += fy / this.mass;
    }

    // Keep Vec2 version for non-hot paths (spawning, perturbation)
    applyForce(force: Vec2): void {
        this.vel.x += force.x / this.mass;
        this.vel.y += force.y / this.mass;
    }

    applyImpulse(impulse: Vec2): void {
        this.vel.x += impulse.x;
        this.vel.y += impulse.y;
    }

    // Absorb another particle — conservation of momentum, inline math
    // Equivalent to: vel = (vel * mass + other.vel * other.mass) / totalMass
    absorb(other: Particle): void {
        const totalMass = this.mass + other.mass;

        // Momentum conservation: new_vel = (m1*v1 + m2*v2) / (m1+m2)
        const newVx =
            (this.vel.x * this.mass + other.vel.x * other.mass) / totalMass;
        const newVy =
            (this.vel.y * this.mass + other.vel.y * other.mass) / totalMass;
        this.vel.x = newVx;
        this.vel.y = newVy;

        this.mass = totalMass;

        if (this.isBlackHole) {
            this.radius = Particle.BLACK_HOLE_RADIUS;
        } else {
            this.radius = Math.min(80, Math.pow(this.mass, 1 / 3) * 1.5);
        }

        if (this.mass >= BLACK_HOLE_MASS_THRESHOLD && !this.isBlackHole) {
            this.isBlackHole = true;
            this.radius = Particle.BLACK_HOLE_RADIUS;
            this.blackHoleAge = 0;
            console.log(
                `🕳️ BLACK HOLE FORMED! Mass: ${this.mass.toFixed(0)}, ID: P${this.id}`
            );
        }
    }

    updateBlackHole(): boolean {
        if (!this.isBlackHole) return false;
        this.blackHoleAge++;
        if (this.blackHoleAge / Particle.BLACK_HOLE_LIFETIME >= 1.0)
            return true;
        this.mass *= 0.998;
        return false;
    }

    // Kinetic energy — inline, no allocations
    kineticEnergy(): number {
        return (
            0.5 *
            this.mass *
            (this.vel.x * this.vel.x + this.vel.y * this.vel.y)
        );
    }

    speed(): number {
        return Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    }

    // Wall bouncing — already inline (no Vec2 ops), kept as-is
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

    /**
     * Collision detection + response — FULLY INLINED, zero Vec2 allocations
     *
     * What this does (in Vec2 terms):
     *   delta = b.pos - a.pos          → dx, dy
     *   dist = delta.length()          → Math.sqrt(dx*dx + dy*dy)
     *   normal = delta / dist          → nx, ny (unit vector from a to b)
     *   relVel = a.vel - b.vel         → rvx, rvy
     *   relVn = relVel.dot(normal)     → rvx*nx + rvy*ny (relative speed along collision axis)
     *   impulse = 2 * relVn / totalMass
     *   a.vel -= normal * impulse * b.mass * damping
     *   b.vel += normal * impulse * a.mass * damping
     *   separate by overlap/2 along normal
     */
    static collide(
        a: Particle,
        b: Particle,
        damping: number
    ): false | 'bounce' | 'absorbed_a' | 'absorbed_b' {
        // delta = b.pos - a.pos (direction from a to b)
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;

        // dist = length of delta
        const distSq = dx * dx + dy * dy;
        const minDist = a.radius + b.radius;

        // Early exit: no collision if distance > sum of radii
        // Using squared distance avoids sqrt when no collision
        if (distSq >= minDist * minDist || distSq === 0) return false;

        const dist = Math.sqrt(distSq);

        // --- Black hole absorption (requires 5 frames continuous contact) ---
        if (a.isBlackHole || b.isBlackHole) {
            const bh = a.isBlackHole ? a : b;
            const other = a.isBlackHole ? b : a;
            const frames = (bh.contactFrames.get(other.id) || 0) + 1;
            bh.contactFrames.set(other.id, frames);

            if (frames >= Particle.BH_ABSORB_CONTACT_FRAMES) {
                bh.absorb(other);
                bh.contactFrames.delete(other.id);
                return a.isBlackHole ? 'absorbed_b' : 'absorbed_a';
            }
        }

        // --- Compression merging (8+ overlapping particles) ---
        a.overlapCount++;
        b.overlapCount++;

        if (
            (a.overlapCount >= COMPRESSION_OVERLAP_THRESHOLD ||
                b.overlapCount >= COMPRESSION_OVERLAP_THRESHOLD) &&
            a.canMerge() &&
            b.canMerge()
        ) {
            if (a.mass >= b.mass) {
                a.absorb(b);
                return 'absorbed_b';
            } else {
                b.absorb(a);
                return 'absorbed_a';
            }
        }

        // --- Normal elastic collision ---

        // normal = delta / dist (unit vector pointing from a to b)
        const nx = dx / dist;
        const ny = dy / dist;

        // relVel = a.vel - b.vel (relative velocity)
        const rvx = a.vel.x - b.vel.x;
        const rvy = a.vel.y - b.vel.y;

        // relVn = relVel dot normal (relative speed along collision axis)
        const relVn = rvx * nx + rvy * ny;

        // Only resolve if particles are moving toward each other
        if (relVn > 0) {
            const totalMass = a.mass + b.mass;
            const impulse = (2 * relVn) / totalMass;

            // a.vel -= normal * (impulse * b.mass * damping)
            const impA = impulse * b.mass * damping;
            a.vel.x -= nx * impA;
            a.vel.y -= ny * impA;

            // b.vel += normal * (impulse * a.mass * damping)
            const impB = impulse * a.mass * damping;
            b.vel.x += nx * impB;
            b.vel.y += ny * impB;
        }

        // Separate overlapping particles by pushing each apart along normal
        const overlap = (minDist - dist) * 0.5;
        a.pos.x -= nx * overlap;
        a.pos.y -= ny * overlap;
        b.pos.x += nx * overlap;
        b.pos.y += ny * overlap;

        return 'bounce';
    }

    /**
     * Gravitational attraction — FULLY INLINED
     *
     * What this does (in Vec2 terms):
     *   delta = b.pos - a.pos
     *   force = G * a.mass * b.mass / (distSq + softening)
     *   forceVec = delta.normalize() * force
     *   a.vel += forceVec / a.mass   (accelerate a toward b)
     *   b.vel -= forceVec / b.mass   (accelerate b toward a)
     */
    static attract(a: Particle, b: Particle, G: number): void {
        // delta = b.pos - a.pos
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;

        // squared distance + softening factor (prevents division by zero)
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) + 1;
        const minDist = a.radius + b.radius;

        // Don't attract if overlapping (collision handles that)
        if (dist <= minDist) return;

        // force magnitude, capped at 50 to prevent extreme accelerations
        const force = Math.min((G * a.mass * b.mass) / (distSq + 100), 50);

        // forceVec = (dx/dist, dy/dist) * force  (force along the line between particles)
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        // acceleration = force / mass, capped to prevent NaN
        // a accelerates toward b: a.vel += forceVec / a.mass
        const ax = fx / a.mass;
        const ay = fy / a.mass;
        if (ax * ax + ay * ay < 100) {
            a.vel.x += ax;
            a.vel.y += ay;
        }

        // b accelerates toward a: b.vel -= forceVec / b.mass
        const bx = fx / b.mass;
        const by = fy / b.mass;
        if (bx * bx + by * by < 100) {
            b.vel.x -= bx;
            b.vel.y -= by;
        }
    }
}
