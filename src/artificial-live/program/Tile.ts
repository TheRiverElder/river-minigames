import Direction from "./Direction";
import Instruction from "./Instruction";
import TileParameter from "./TileParameter";
import type TileType from "./TileType";

export default abstract class Tile {

    public readonly type: TileType;
    public readonly parameters: Array<TileParameter>;
    public direction: Direction;

    constructor(type: TileType, parameters: Array<TileParameter> = [], direction: Direction = Direction.NONE) {
        this.type = type;
        this.parameters = parameters;
        this.direction = direction;
    }

    public setParameterOn(parameter: TileParameter, direction: Direction) {
        if (parameter.direction === direction) return;

        const conflictParameter = this.getParameterOn(direction);
        if (!!conflictParameter) {
            conflictParameter.direction = parameter.direction;
        }
        parameter.direction = direction;
    }

    public getParameterOn(direction: Direction): TileParameter | null {
        return this.parameters.find(p => p.direction === direction) || null;
    }

    public rotate(antiClockwise: boolean = false) {
        if (this.direction === Direction.NONE) return;
        this.direction = antiClockwise ? this.direction.left : this.direction.right;
    }

    abstract get terminal(): boolean;
    abstract get activative(): boolean;

    abstract compile(output: Array<Instruction>): void;
    
    abstract copy(): Tile;

    abstract render(g: CanvasRenderingContext2D): void;
}