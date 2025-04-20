import Vector2 from "../../libs/math/Vector2";

export default class ValuePack {

    constructor(
        public readonly direction: Vector2,
        public readonly valueType: string,
        public readonly value = 0,
    ) { }

    clone(): ValuePack {
        return new ValuePack(this.direction, this.valueType, this.value);
    }
}