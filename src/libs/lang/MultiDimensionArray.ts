import { int } from "../CommonTypes";
import { createArray } from "./Collections";



export default class Array2D<T = any> {

    public readonly width: int;
    public readonly height: int;

    private readonly rows: Array<Array<T | null>>;

    constructor(width: int, height: int) {
        this.width = width;
        this.height = height;
        this.rows = Array(height);
        for (let y = 0; y < height; y++) {
            this.rows[y] = Array(width).fill(null);
        }
    }

    public getRows(): Array<Array<T | null>> {
        return this.rows.map(row => row.slice());
    }

    public getColumns(): Array<Array<T | null>> {
        return createArray(this.width, x => this.getColumn(x));
    }

    public getRow(y: int): Array<T | null> {
        return this.rows[y]?.slice() || [];
    }

    public getColumn(x: int): Array<T | null> {
        return this.rows.map(row => row ? row[x] : null);
    }

    public get(x: int, y: int): T | null {
        const row = this.rows[y];
        if (!row) return null;
        return row[x] || null;
    }

    public set(x: int, y: int, value: T | null) {
        const row = this.rows[y];
        if (!row) return null;
        row[x] = value;
    }

    public forEach(callback: (value: T | null, x: int, y: int) => void) {
        for (let y = 0; y < this.height; y++) {
            const row = this.rows[y];
            for (let x = 0; x < this.width; x++) {
                callback(row[x], x, y);
            }
        }
    }

    public map<R>(callback: (value: T | null, x: int, y: int) => R): Array2D<R> {
        const result = new Array2D(this.width, this.height);

        for (let y = 0; y < this.height; y++) {
            const row = this.rows[y];
            const resultRow = result.rows[y];
            for (let x = 0; x < this.width; x++) {
                resultRow[x] = callback(row[x], x, y);
            }
        }

        return result;
    }

    public getAll(): Array<T | null> {
        return this.rows.flat(1);
    }
}