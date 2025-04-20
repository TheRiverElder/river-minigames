import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";

export default class Grid<T> {

    protected data: (T | null)[];

    constructor(
        public readonly width: int,
        public readonly height: int,
        data?: (T | null)[],
    ) {
        this.data = new Array(width * height).fill(null);
        if (data) {
            for (let i = 0; i < Math.min(data.length, this.data.length); i++) {
                this.data[i] = data[i];
            }
        }
    }

    public get size() {
        return this.width * this.height;
    }

    public getIndex(x: int, y: int): number {
        return (y * this.width) + x;
    }

    public getCoord(index: number): Vector2 {
        const y = Math.floor(index / this.width);
        const x = index % this.width;

        return new Vector2(x, y);
    }

    public get(position: Vector2): T | null {
        if (!this.isInside(position.x, position.y)) return null;
        return this.data[this.getIndex(position.x, position.y)];
    }

    public getAt(x: int, y: int): T | null {
        if (!this.isInside(x, y)) return null;
        return this.data[this.getIndex(x, y)];
    }

    public isInBounds(position: Vector2) {
        const { x, y } = position;
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    public isInside(x: int, y: int) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    public set(position: Vector2, value: T | null): void {
        if (!this.isInside(position.x, position.y)) return;
        this.data[this.getIndex(position.x, position.y)] = value;
    }

    public setAt(x: int, y: int, value: T | null): void {
        if (!this.isInside(x, y)) return;
        this.data[this.getIndex(x, y)] = value;
    }

    public forEach(callbackfn: (value: T | null, x: number, y: number) => void): void {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                callbackfn(this.getAt(x, y), x, y);
            }
        }
    }

    public clear(): void {
        this.data.fill(null);
    }

    public copy(): Grid<T> {
        return new Grid(this.width, this.height, [...this.data]);
    }
}