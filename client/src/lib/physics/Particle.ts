import { Vec2 } from './Vec2';

export interface ParticleConfig {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
}

// Black hole forms when a single particle accumulates this much mass through merging
// Black hole forms when mass exceeds this
export const BLACK_HOLE_MASS_THRESHOLD = 100000;
export const MERGE_SPEED_THRESHOLD = 15;
export const COMPRESSION_OVERLAP_THRESHOLD = 8; // need 8+ overlapping particles to merge

export class Particle {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    mass: number;
    isBlackHole: boolean = false;
    overlapCount: number = 0; // number of overlapping particles this frame
    age: number = 0; // frames since creation
    contactFrames: Map<number, number> = new Map(); // track continuous contact with other particles
    static readonly MERGE_COOLDOWN = 300; // can't merge for first 5 seconds
    static readonly BH_ABSORB_CONTACT_FRAMES = 5; // need 5 continuous frames of contact to absorb
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
        this.age++;
    }

    canMerge(): boolean {
        return this.age > Particle.MERGE_COOLDOWN;
    }

    applyForce(force: Vec2): void {
        this.vel.addMut(force.div(this.mass));
    }

    applyImpulse(impulse: Vec2): void {
        this.vel.addMut(impulse);
    }

    blackHoleAge: number = 0; // frames since becoming a black hole
    static readonly BLACK_HOLE_LIFETIME = 1800; // ~30 seconds at 60fps
    static readonly BLACK_HOLE_RADIUS = 5; // very small collision radius

    /** Absorb another particle — merge mass and momentum */
    absorb(other: Particle): void {
        const totalMass = this.mass + other.mass;
        this.vel = this.vel
            .mul(this.mass)
            .add(other.vel.mul(other.mass))
            .div(totalMass);
        this.mass = totalMass;

        if (this.isBlackHole) {
            // Black holes stay small — collision radius fixed
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

    /** Returns true if this black hole has evaporated */
    updateBlackHole(): boolean {
        if (!this.isBlackHole) return false;
        this.blackHoleAge++;

        // Evaporate: lose mass over time (Hawking radiation)
        const lifeRatio = this.blackHoleAge / Particle.BLACK_HOLE_LIFETIME;
        if (lifeRatio >= 1.0) {
            return true; // evaporated — should be removed
        }

        // Shrink mass as it evaporates
        this.mass *= 0.998;
        return false;
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

    /**
     * Returns: false (no collision), 'bounce', 'absorbed_b' (a ate b), 'absorbed_a' (b ate a)
     */
    static collide(
        a: Particle,
        b: Particle,
        damping: number
    ): false | 'bounce' | 'absorbed_a' | 'absorbed_b' {
        const delta = b.pos.sub(a.pos);
        const dist = delta.length();
        const minDist = a.radius + b.radius;

        if (dist >= minDist || dist === 0) return false;

        // Black hole absorption — requires 5 continuous frames of direct contact
        if (a.isBlackHole || b.isBlackHole) {
            const bh = a.isBlackHole ? a : b;
            const other = a.isBlackHole ? b : a;

            // Track continuous contact frames
            const frames = (bh.contactFrames.get(other.id) || 0) + 1;
            bh.contactFrames.set(other.id, frames);

            if (frames >= Particle.BH_ABSORB_CONTACT_FRAMES) {
                bh.absorb(other);
                bh.contactFrames.delete(other.id);
                return a.isBlackHole ? 'absorbed_b' : 'absorbed_a';
            }

            // Still in contact but not long enough — bounce normally
            // (fall through to elastic collision below)
        }

        // Track overlap for compression detection
        a.overlapCount++;
        b.overlapCount++;

        // Compression merging — particles squeezed by 8+ neighbors merge
        // Both particles must be past the cooldown period
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

        // High-speed impact merging (commented out — keeping for future use)
        // const relSpeed = a.vel.sub(b.vel).length();
        // if (relSpeed > MERGE_SPEED_THRESHOLD && a.canMerge() && b.canMerge()) {
        //     if (a.mass >= b.mass) { a.absorb(b); return 'absorbed_b'; }
        //     else { b.absorb(a); return 'absorbed_a'; }
        // }

        // Normal elastic collision
        const normal = delta.div(dist);
        const relVel = a.vel.sub(b.vel);
        const relVn = relVel.dot(normal);

        if (relVn > 0) {
            const totalMass = a.mass + b.mass;
            const impulse = (2 * relVn) / totalMass;
            a.vel.subMut(normal.mul(impulse * b.mass * damping));
            b.vel.addMut(normal.mul(impulse * a.mass * damping));
        }

        const overlap = (minDist - dist) / 2;
        a.pos.subMut(normal.mul(overlap));
        b.pos.addMut(normal.mul(overlap));

        return 'bounce';
    }

    static attract(a: Particle, b: Particle, G: number): void {
        const delta = b.pos.sub(a.pos);
        const distSq = delta.lengthSq();
        const dist = Math.sqrt(distSq) + 1;
        const minDist = a.radius + b.radius;

        if (dist <= minDist) return;

        const force = Math.min((G * a.mass * b.mass) / (distSq + 100), 50); // cap force
        const forceVec = delta.div(dist).mul(force);

        const accA = forceVec.div(a.mass);
        const accB = forceVec.div(b.mass);

        // Clamp acceleration to prevent NaN/Infinity
        if (accA.lengthSq() < 100) a.vel.addMut(accA);
        if (accB.lengthSq() < 100) b.vel.subMut(accB);
    }
}
