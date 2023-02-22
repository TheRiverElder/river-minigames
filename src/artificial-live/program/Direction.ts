import Vector2 from "../../libs/math/Vector2"

export default class Direction {
    static readonly UP = new Direction(new Vector2(0, -1)); 
    static readonly DOWN = new Direction(new Vector2(0, +1)); 
    static readonly LEFT = new Direction(new Vector2(-1, 0)); 
    static readonly RIGHT = new Direction(new Vector2(+1, 0)); 

    public readonly offset: Vector2;

    private constructor(offset: Vector2) {
        this.offset = offset;
    }
}