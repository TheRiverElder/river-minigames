import Direction from "./Direction";

export default class TileParameter<T = any> {
    public readonly type: string;
    public readonly optional: boolean;
    public readonly defaultValue: T;
    public direction: Direction;

    constructor(type: string, optional: boolean, defaultValue: T, direction: Direction = Direction.NONE) {
        this.type = type;
        this.optional = optional;
        this.defaultValue = defaultValue;
        this.direction = direction;
    }

    public copy(): TileParameter<T> {
        return new TileParameter(this.type, this.optional, this.defaultValue, this.direction);
    }

}