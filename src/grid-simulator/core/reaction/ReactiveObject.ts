import ValuePack from "./ValuePack";
import ActualValueType from "../value/ActualValueType";
import CalculativeValueType from "../value/CalculativeValueType";

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
    
    getCalculatedValue(key: CalculativeValueType, cache = true): number {
        if (this.cachedCalculativeValues.has(key)) {
            return this.cachedCalculativeValues.get(key)!;
        }
        const value = key.calculate(this);
        if (cache) {
            this.cachedCalculativeValues.set(key, value);
        }
        return value;
    }

    clearCachedCalculativeValues() {
        this.cachedCalculativeValues.clear();
    }
}