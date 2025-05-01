import Vector2 from "../../../libs/math/Vector2";
import ActualValueType from "../value/ActualValueType";

export default class ValuePack {

    private _value: number;
    get value(): number { return this._value; }

    constructor(
        public readonly direction: Vector2,
        public readonly valueType: ActualValueType,
        value = 0,
    ) { 
        this._value = value;
    }

    clone(): ValuePack {
        return new ValuePack(this.direction, this.valueType, this.value);
    }

    changeValue(delta: number) {
        this._value += delta;
    }
}