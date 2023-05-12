import { int } from "../../libs/CommonTypes";

export default class TileParameter<T = any> {
    public readonly type: string;
    public readonly ordinal: int;
    public readonly optional: boolean;
    public readonly defaultValue: T;

    constructor(type: string, ordinal: int, optional: boolean, defaultValue: T) {
        this.type = type;
        this.ordinal = ordinal;
        this.optional = optional;
        this.defaultValue = defaultValue;
    }

    public copy(): TileParameter<T> {
        return new TileParameter(this.type, this.ordinal, this.optional, this.defaultValue);
    }

}