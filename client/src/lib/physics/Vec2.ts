export class Vec2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  static from(x: number, y: number): Vec2 {
    return new Vec2(x, y);
  }

  static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  static random(scale: number = 1): Vec2 {
    const angle = Math.random() * Math.PI * 2;
    return new Vec2(Math.cos(angle) * scale, Math.sin(angle) * scale);
  }

  static fromAngle(angle: number, magnitude: number = 1): Vec2 {
    return new Vec2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  div(s: number): Vec2 {
    return new Vec2(this.x / s, this.y / s);
  }

  addMut(v: Vec2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subMut(v: Vec2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mulMut(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(): Vec2 {
    const len = this.length();
    return len > 0 ? this.div(len) : Vec2.zero();
  }

  distTo(v: Vec2): number {
    return this.sub(v).length();
  }

  distSqTo(v: Vec2): number {
    return this.sub(v).lengthSq();
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  angleTo(v: Vec2): number {
    return v.sub(this).angle();
  }

  lerp(v: Vec2, t: number): Vec2 {
    return this.add(v.sub(this).mul(t));
  }

  clamp(min: number, max: number): Vec2 {
    const len = this.length();
    if (len < min) return this.normalize().mul(min);
    if (len > max) return this.normalize().mul(max);
    return this.clone();
  }
}
