import { Vec2 } from './Vec2';
import { Particle } from './Particle';

export interface CellInfo {
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
}

export class SpatialHash {
  private cells: Map<number, Particle[]> = new Map();
  private cols: number;
  private rows: number;

  constructor(
    public width: number,
    public height: number,
    public cellSize: number
  ) {
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
  }

  private key(col: number, row: number): number {
    return row * this.cols + col;
  }

  private cellFor(x: number, y: number): [number, number] {
    const col = Math.max(0, Math.min(this.cols - 1, (x / this.cellSize) | 0));
    const row = Math.max(0, Math.min(this.rows - 1, (y / this.cellSize) | 0));
    return [col, row];
  }

  insert(p: Particle): boolean {
    const [col, row] = this.cellFor(p.pos.x, p.pos.y);
    const k = this.key(col, row);
    let cell = this.cells.get(k);
    if (!cell) {
      cell = [];
      this.cells.set(k, cell);
    }
    cell.push(p);
    return true;
  }

  queryRadius(
    center: Vec2,
    radius: number,
    found: Particle[] = []
  ): Particle[] {
    const r2 = radius * radius;
    const [minCol, minRow] = this.cellFor(center.x - radius, center.y - radius);
    const [maxCol, maxRow] = this.cellFor(center.x + radius, center.y + radius);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const cell = this.cells.get(this.key(col, row));
        if (!cell) continue;
        for (const p of cell) {
          const dx = p.pos.x - center.x;
          const dy = p.pos.y - center.y;
          if (dx * dx + dy * dy <= r2) {
            found.push(p);
          }
        }
      }
    }
    return found;
  }

  detectCollisions(damping: number, absorbed: Set<number> = new Set()): number {
    let collisions = 0;

    // For each occupied cell, check particles against same cell + 3 forward neighbors
    // (right, below, below-right) to avoid duplicate pair checks
    for (const [k, cell] of this.cells) {
      const row = (k / this.cols) | 0;
      const col = k % this.cols;

      // Intra-cell collisions
      for (let i = 0; i < cell.length; i++) {
        if (absorbed.has(cell[i].id)) continue;
        for (let j = i + 1; j < cell.length; j++) {
          if (absorbed.has(cell[j].id)) continue;
          const result = Particle.collide(cell[i], cell[j], damping);
          if (result) {
            collisions++;
            if (result === 'absorbed_a') absorbed.add(cell[i].id);
            if (result === 'absorbed_b') absorbed.add(cell[j].id);
          }
        }

        // Check against 4 forward neighbors: right, below-left, below, below-right
        const neighbors = [
          [col + 1, row],
          [col - 1, row + 1],
          [col, row + 1],
          [col + 1, row + 1]
        ];

        for (const [nc, nr] of neighbors) {
          if (nc < 0 || nc >= this.cols || nr < 0 || nr >= this.rows) continue;
          const neighbor = this.cells.get(this.key(nc, nr));
          if (!neighbor) continue;

          for (const other of neighbor) {
            if (absorbed.has(cell[i].id) || absorbed.has(other.id)) continue;
            const result = Particle.collide(cell[i], other, damping);
            if (result) {
              collisions++;
              if (result === 'absorbed_a') absorbed.add(cell[i].id);
              if (result === 'absorbed_b') absorbed.add(other.id);
            }
          }
        }
      }
    }

    return collisions;
  }

  /** Iterate all occupied cells for visualization */
  forEachCell(callback: (info: CellInfo) => void): void {
    for (const [k, cell] of this.cells) {
      if (cell.length === 0) continue;
      const row = (k / this.cols) | 0;
      const col = k % this.cols;
      callback({
        col,
        row,
        x: col * this.cellSize,
        y: row * this.cellSize,
        w: this.cellSize,
        h: this.cellSize,
        count: cell.length
      });
    }
  }

  /** Total number of columns */
  getCols(): number {
    return this.cols;
  }
  /** Total number of rows */
  getRows(): number {
    return this.rows;
  }
  /** Cell size in pixels */
  getCellSize(): number {
    return this.cellSize;
  }
}
