import { square } from "./functions";

export default class Vector2 {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    public sub(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public mul(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    public div(factor: number): Vector2 {
        return new Vector2(this.x / factor, this.y / factor);
    }

    public angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public moduloSquared(): number {
        return square(this.x) + square(this.y);
    }

    public modulo(): number {
        return Math.sqrt(this.moduloSquared());
    }

    public normalize(): Vector2 {
        if (this.moduloSquared() === 0) return this;
        return this.mul(1.0 / this.modulo());
    }

    public toArray(): [number, number] {
        return [this.x, this.y];
    }

}