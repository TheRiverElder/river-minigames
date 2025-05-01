import ValuePack from "./ValuePack";
import ActualValueType from "../value/ActualValueType";
import CalculativeValueType from "../value/CalculativeValueType";
import ValueType from "../value/ValueType";
import PropertyValueType from "../value/PropertyValueType";

export default abstract class ReactiveObject {

    private readonly actualValues = new Map<ActualValueType, number>();
    private readonly cachedCalculativeValues = new Map<CalculativeValueType, number>();

    abstract get mass(): number;

    public receivePack(pack: ValuePack): void {
        this.changeActualValue(pack.valueType, +pack.value);
    }

    getValueTypes() {
        return Array.from(this.actualValues.keys());
    }

    getValue(type: ValueType) {
        return type.getValueIn(this);
    }

    getActualValue(key: ActualValueType) {
        return this.actualValues.get(key) ?? 0;
    }

    setActualValue(key: ActualValueType, value: number) {
        this.actualValues.set(key, value);
    }

    changeActualValue(key: ActualValueType, delta: number) {
        const currentValue = this.getActualValue(key);
        this.setActualValue(key, currentValue + delta);
    }

    getCalculatedValue(key: CalculativeValueType, cache = false): number {
        if (this.cachedCalculativeValues.has(key)) {
            return this.cachedCalculativeValues.get(key)!;
        }
        const value = key.calculate(this);
        if (cache) {
            this.cachedCalculativeValues.set(key, value);
        }
        return value;
    }

    clearCachedCalculativeValue(key: CalculativeValueType) {
        this.cachedCalculativeValues.delete(key);
    }

    clearCachedCalculativeValues() {
        this.cachedCalculativeValues.clear();
    }

    // to be overriden by subclasses
    getPropertyValue(key: PropertyValueType) {
        return 0;
    }
}