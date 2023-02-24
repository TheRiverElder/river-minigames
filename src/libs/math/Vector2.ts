import { square } from "./Mathmatics";

export default class Vector2 {

    public static readonly INVALID_VECTOR2: Vector2 = new Vector2(Number.NaN, Number.NaN);

    public static fromPole(angle: number, modulo: number) {
        return new Vector2(
            modulo * Math.cos(angle),
            modulo * Math.sin(angle),
        );
    }

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

    public manhattanDistanceTo(vector: Vector2): number {
        return Math.abs(vector.x - this.x) + Math.abs(vector.y - this.y);
    }

    public distanceTo(vector: Vector2): number {
        return Math.sqrt(this.distanceSquaredTo(vector));
    }

    public distanceSquaredTo(vector: Vector2): number {
        return square(vector.x - this.x) + square(vector.y - this.y);
    }


    public toArray(): [number, number] {
        return [this.x, this.y];
    }

    public isValid() {
        return !this.isInvalid();
    }

    public isInvalid() {
        return this === Vector2.INVALID_VECTOR2 || (Number.isNaN(this.x) || Number.isNaN(this.y));
    }

}