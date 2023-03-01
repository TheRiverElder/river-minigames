import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2"

export default class Direction {

    private static valuesInOrder: Array<Direction> = [];

    static readonly NONE = new Direction(-1, "none", Vector2.INVALID_VECTOR2); 
    static readonly UP = new Direction(0, "up", new Vector2(0, -1)); 
    static readonly RIGHT = new Direction(1, "right", new Vector2(+1, 0)); 
    static readonly DOWN = new Direction(2, "down", new Vector2(0, +1)); 
    static readonly LEFT = new Direction(3, "left", new Vector2(-1, 0)); 

    public readonly ordinal: int;
    public readonly id: string;
    public readonly offset: Vector2;

    private constructor(ordinal: int, id: string, offset: Vector2) {
        this.ordinal = ordinal;
        this.id = id;
        this.offset = offset;
        if (ordinal >= 0) {
            Direction.valuesInOrder[ordinal] = this;
        }
    }

    public get back(): Direction {
        return Direction.valuesInOrder[(this.ordinal + 2) % 4];
    }

    public get left(): Direction {
        return Direction.valuesInOrder[(this.ordinal + 3) % 4];
    }

    public get right(): Direction {
        return Direction.valuesInOrder[(this.ordinal + 1) % 4];
    }

    toString() {
        return this.id;
    }
}