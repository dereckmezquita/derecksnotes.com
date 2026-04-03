import { Vec2 } from './Vec2';
import { Particle } from './Particle';
import { QuadTree } from './QuadTree';

const o = (a: number) => `hsla(22, 85%, 38%, ${a})`;
const gr = (a: number) => `hsla(0, 0%, 30%, ${a})`;

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  clear(w: number, h: number): void {
    this.ctx.clearRect(0, 0, w, h);
  }

  drawTrails(particles: Particle[]): void {
    for (const p of particles) {
      if (p.trail.length < 2) continue;
      for (let i = 1; i < p.trail.length; i++) {
        const alpha = (i / p.trail.length) * 0.45;
        this.ctx.beginPath();
        this.ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
        this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
        this.ctx.strokeStyle = o(alpha);
        this.ctx.lineWidth = 1.5 + i / p.trail.length;
        this.ctx.stroke();
      }
    }
  }

  drawParticles(particles: Particle[]): void {
    for (const p of particles) {
      // Circle
      this.ctx.beginPath();
      this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = o(0.18);
      this.ctx.fill();
      this.ctx.strokeStyle = o(0.9);
      this.ctx.lineWidth = 1.8;
      this.ctx.stroke();

      // Crosshair
      const cr = p.radius + 5;
      this.ctx.beginPath();
      this.ctx.moveTo(p.pos.x - cr, p.pos.y);
      this.ctx.lineTo(p.pos.x - p.radius * 0.35, p.pos.y);
      this.ctx.moveTo(p.pos.x + p.radius * 0.35, p.pos.y);
      this.ctx.lineTo(p.pos.x + cr, p.pos.y);
      this.ctx.moveTo(p.pos.x, p.pos.y - cr);
      this.ctx.lineTo(p.pos.x, p.pos.y - p.radius * 0.35);
      this.ctx.moveTo(p.pos.x, p.pos.y + p.radius * 0.35);
      this.ctx.lineTo(p.pos.x, p.pos.y + cr);
      this.ctx.strokeStyle = o(0.5);
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // Labels
      this.ctx.font = '10px Roboto, sans-serif';
      this.ctx.fillStyle = o(0.9);
      this.ctx.fillText(`P${p.id}`, p.pos.x + cr + 3, p.pos.y - 4);
      this.ctx.font = '9px Roboto, sans-serif';
      this.ctx.fillStyle = gr(0.7);
      this.ctx.fillText(
        `r=${p.radius.toFixed(1)}`,
        p.pos.x + cr + 3,
        p.pos.y + 8
      );
    }
  }

  drawVelocityVectors(particles: Particle[]): void {
    for (const p of particles) {
      const end = p.pos.add(p.vel.mul(5));
      this.ctx.beginPath();
      this.ctx.moveTo(p.pos.x, p.pos.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.strokeStyle = o(0.75);
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      const angle = p.vel.angle();
      this.ctx.beginPath();
      this.ctx.moveTo(end.x, end.y);
      this.ctx.lineTo(
        end.x - 5 * Math.cos(angle - 0.4),
        end.y - 5 * Math.sin(angle - 0.4)
      );
      this.ctx.moveTo(end.x, end.y);
      this.ctx.lineTo(
        end.x - 5 * Math.cos(angle + 0.4),
        end.y - 5 * Math.sin(angle + 0.4)
      );
      this.ctx.stroke();
    }
  }

  drawAnnotations(particles: Particle[], count: number): void {
    this.ctx.font = '10px Roboto, sans-serif';
    for (let i = 0; i < Math.min(count, particles.length); i++) {
      const p = particles[i];
      const speed = p.speed();
      const ke = p.kineticEnergy();
      const ang = p.vel.angle() * (180 / Math.PI);
      const ox = p.pos.x + p.radius + 22;
      const oy = p.pos.y - p.radius;

      this.ctx.fillStyle = o(0.85);
      this.ctx.fillText(`|v| = ${speed.toFixed(1)}`, ox, oy);
      this.ctx.fillStyle = gr(0.75);
      this.ctx.fillText(`\u03B8 = ${ang.toFixed(0)}\u00B0`, ox, oy + 12);
      this.ctx.fillText(`KE = ${ke.toFixed(0)}`, ox, oy + 24);
    }
  }

  drawDimLines(particles: Particle[], maxDist: number): void {
    const N = particles.length;
    // Limit dimension lines to avoid performance issues with many particles
    const limit = Math.min(N, 30);
    for (let i = 0; i < limit; i++) {
      for (let j = i + 1; j < limit; j++) {
        const dist = particles[i].pos.distTo(particles[j].pos);
        if (dist < maxDist) {
          this.dimLine(
            particles[i].pos,
            particles[j].pos,
            `${dist.toFixed(0)}`
          );
        }
      }
    }
  }

  drawMouseAttractor(mouse: Vec2, particles: Particle[], range: number): void {
    this.ctx.beginPath();
    this.ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
    this.ctx.strokeStyle = o(0.5);
    this.ctx.lineWidth = 1.2;
    this.ctx.setLineDash([3, 3]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.beginPath();
    this.ctx.moveTo(mouse.x - 6, mouse.y);
    this.ctx.lineTo(mouse.x + 6, mouse.y);
    this.ctx.moveTo(mouse.x, mouse.y - 6);
    this.ctx.lineTo(mouse.x, mouse.y + 6);
    this.ctx.strokeStyle = o(0.4);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    for (const p of particles) {
      if (p.pos.distTo(mouse) < range) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.pos.x, p.pos.y);
        this.ctx.lineTo(mouse.x, mouse.y);
        this.ctx.strokeStyle = o(0.07);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      }
    }
  }

  drawSlingshot(start: Vec2, mouse: Vec2, previewRadius: number): void {
    const delta = start.sub(mouse);
    const dist = delta.length();
    const angle = delta.angle();
    const speed = dist * 0.08;

    // Pull line
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(mouse.x, mouse.y);
    this.ctx.strokeStyle = o(0.4);
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Launch arrow
    const arrowLen = Math.min(dist * 0.6, 80);
    const arrowEnd = start.add(Vec2.fromAngle(angle, arrowLen));
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(arrowEnd.x, arrowEnd.y);
    this.ctx.strokeStyle = o(0.7);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(arrowEnd.x, arrowEnd.y);
    this.ctx.lineTo(
      arrowEnd.x - 8 * Math.cos(angle - 0.35),
      arrowEnd.y - 8 * Math.sin(angle - 0.35)
    );
    this.ctx.moveTo(arrowEnd.x, arrowEnd.y);
    this.ctx.lineTo(
      arrowEnd.x - 8 * Math.cos(angle + 0.35),
      arrowEnd.y - 8 * Math.sin(angle + 0.35)
    );
    this.ctx.stroke();

    // Preview circle
    this.ctx.beginPath();
    this.ctx.arc(start.x, start.y, previewRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = o(0.5);
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([3, 3]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Speed label
    this.ctx.font = '11px Roboto, sans-serif';
    this.ctx.fillStyle = o(0.85);
    this.ctx.fillText(
      `v = ${speed.toFixed(1)}`,
      start.x + previewRadius + 8,
      start.y - 6
    );
    this.ctx.fillText(
      `\u03B8 = ${((angle * 180) / Math.PI).toFixed(0)}\u00B0`,
      start.x + previewRadius + 8,
      start.y + 8
    );
  }

  drawGroundLine(y: number, w: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(w, y);
    this.ctx.strokeStyle = gr(0.35);
    this.ctx.lineWidth = 0.6;
    this.ctx.setLineDash([6, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawGravitationalGrid(
    w: number,
    h: number,
    particles: Particle[],
    qt: QuadTree,
    spacing: number = 12,
    strength: number = 800
  ): void {
    const ctx = this.ctx;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const influenceRadius = 150; // only particles within this range affect grid

    // Build displacement grid — use quadtree for spatial lookup
    const displaced: Vec2[][] = [];
    for (let row = 0; row < rows; row++) {
      displaced[row] = [];
      for (let col = 0; col < cols; col++) {
        const baseX = col * spacing;
        const baseY = row * spacing;
        let dx = 0,
          dy = 0;

        // Query only nearby particles via quadtree
        const center = Vec2.from(baseX, baseY);
        const nearby = qt.queryRadius(center, influenceRadius);

        for (const p of nearby) {
          const diffX = p.pos.x - baseX;
          const diffY = p.pos.y - baseY;
          const distSq = diffX * diffX + diffY * diffY;
          const dist = Math.sqrt(distSq) + 1;

          const pull = (strength * p.mass) / (distSq + 500);
          const maxPull = spacing * 0.8;
          const clampedPull = Math.min(pull, maxPull);

          dx += (diffX / dist) * clampedPull;
          dy += (diffY / dist) * clampedPull;
        }

        displaced[row][col] = Vec2.from(baseX + dx, baseY + dy);
      }
    }

    // Draw horizontal grid lines
    ctx.strokeStyle = 'hsla(0, 0%, 85%, 0.6)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row < rows; row++) {
      ctx.beginPath();
      ctx.moveTo(displaced[row][0].x, displaced[row][0].y);
      for (let col = 1; col < cols; col++) {
        ctx.lineTo(displaced[row][col].x, displaced[row][col].y);
      }
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      ctx.moveTo(displaced[0][col].x, displaced[0][col].y);
      for (let row = 1; row < rows; row++) {
        ctx.lineTo(displaced[row][col].x, displaced[row][col].y);
      }
      ctx.stroke();
    }
  }

  drawQuadTree(qt: QuadTree): void {
    qt.draw(this.ctx, 'hsla(210, 50%, 60%, 0.25)', 'hsla(210, 60%, 70%, 0.12)');
  }

  drawAxes(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(16, 50);
    this.ctx.lineTo(16, 18);
    this.ctx.moveTo(16, 50);
    this.ctx.lineTo(48, 50);
    this.ctx.strokeStyle = gr(0.55);
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(16, 18);
    this.ctx.lineTo(13, 23);
    this.ctx.moveTo(16, 18);
    this.ctx.lineTo(19, 23);
    this.ctx.moveTo(48, 50);
    this.ctx.lineTo(43, 47);
    this.ctx.moveTo(48, 50);
    this.ctx.lineTo(43, 53);
    this.ctx.stroke();
    this.ctx.font = '10px Roboto, sans-serif';
    this.ctx.fillStyle = gr(0.6);
    this.ctx.fillText('y', 6, 22);
    this.ctx.fillText('x', 50, 54);
  }

  drawScaleBar(w: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(w - 62, 18);
    this.ctx.lineTo(w - 12, 18);
    this.ctx.moveTo(w - 62, 14);
    this.ctx.lineTo(w - 62, 22);
    this.ctx.moveTo(w - 12, 14);
    this.ctx.lineTo(w - 12, 22);
    this.ctx.strokeStyle = gr(0.5);
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();
    this.ctx.font = '10px Roboto, sans-serif';
    this.ctx.fillStyle = gr(0.6);
    this.ctx.fillText('50px', w - 50, 14);
  }

  private dimLine(a: Vec2, b: Vec2, label: string): void {
    const delta = b.sub(a);
    const len = delta.length();
    if (len < 35) return;

    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(b.x, b.y);
    this.ctx.strokeStyle = gr(0.2);
    this.ctx.lineWidth = 0.5;
    this.ctx.setLineDash([2, 3]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    const normal = Vec2.from(-delta.y / len, delta.x / len);
    this.ctx.beginPath();
    this.ctx.moveTo(a.x + normal.x * 4, a.y + normal.y * 4);
    this.ctx.lineTo(a.x - normal.x * 4, a.y - normal.y * 4);
    this.ctx.moveTo(b.x + normal.x * 4, b.y + normal.y * 4);
    this.ctx.lineTo(b.x - normal.x * 4, b.y - normal.y * 4);
    this.ctx.stroke();

    const mid = a.lerp(b, 0.5);
    this.ctx.font = '9px Roboto, sans-serif';
    this.ctx.fillStyle = gr(0.6);
    this.ctx.fillText(label, mid.x + 4, mid.y - 4);
  }
}
