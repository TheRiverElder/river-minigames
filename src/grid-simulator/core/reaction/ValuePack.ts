import Vector2 from "../../../libs/math/Vector2";
import ActualValueType from "../value/ActualValueType";

export default class ValuePack {

    constructor(
        public readonly direction: Vector2,
        public readonly valueType: ActualValueType,
        public readonly value = 0,
    ) { }

    clone(): ValuePack {
        return new ValuePack(this.direction, this.valueType, this.value);
    }
}