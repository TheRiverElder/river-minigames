import Vector2 from "../../libs/math/Vector2"

export default class Direction {
    static readonly NONE = new Direction("none", Vector2.INVALID_VECTOR2); 
    static readonly UP = new Direction("up", new Vector2(0, -1)); 
    static readonly DOWN = new Direction("down", new Vector2(0, +1)); 
    static readonly LEFT = new Direction("left", new Vector2(-1, 0)); 
    static readonly RIGHT = new Direction("right", new Vector2(+1, 0)); 

    public readonly id: string;
    public readonly offset: Vector2;

    private constructor(id: string, offset: Vector2) {
        this.id = id;
        this.offset = offset;
    }

    toString() {
        return this.id;
    }
}