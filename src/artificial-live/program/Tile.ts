import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Part from "../model/Part";
import Cell from "./Cell";
import Direction from "./Direction";
import TileParameter from "./TileParameter";
import type TileType from "./TileType";

export default abstract class Tile {

    public readonly type: TileType;
    public direction: Direction;

    constructor(type: TileType, direction: Direction = Direction.NONE) {
        this.type = type;
        this.direction = direction;
    }

    isValid() {
        return this.checkParametersValid();
    }

    checkParametersValid(): Nullable<string> {
        const ordinals = new Set<int>();
        const directions = new Set<Direction>();

        const parameters = this.parameters;
        if (!parameters) return null;

        for (const [parameter, direction] of Array.from(parameters.entries())) {
            const ordinal = parameter.ordinal;
            if (ordinals.has(ordinal)) return `序号${ordinal}出现多于1个参数`;
            ordinals.add(ordinal);
            if (direction !== Direction.NONE) {
                if (directions.has(direction)) return `方向${direction}出现多于1个参数`;
                directions.add(direction);
            } else if (!parameter.optional) return `必要参数缺失`;
        }

        return null;
    }

    public getParameterOn(direction: Direction): Nullable<TileParameter> {
        const parameters = this.parameters;
        if (!parameters) return null;
        return (Array.from(parameters.entries()).find(([p, d]) => d === direction) || [null])[0];
    }

    public rotate(antiClockwise: boolean = false) {
        if (this.direction === Direction.NONE) return;
        this.direction = antiClockwise ? this.direction.left : this.direction.right;
    }

    get terminal(): boolean {
        return false;
    }

    get activative(): boolean {
        return false;
    }

    get parameters(): Nullable<Map<TileParameter, Direction>> {
        return null;
    }

    receiveArgument(direction: Direction, arg: any, cell: Cell, part: Part) {
        const dir = direction.back;
        const parameter = this.getParameterOn(dir);
        if (!parameter) return;
        let args = part.memory.get(cell.x, cell.y);
        if (!args) {
            args = [];
            part.memory.set(cell.x, cell.y, args);
        }
        args[parameter.ordinal] = arg;
    }

    // abstract compile(output: Array<Instruction>): void;

    abstract execute(cell: Cell, part: Part): void;
    
    abstract copy(): Tile;

    abstract render(g: CanvasRenderingContext2D): void;
}