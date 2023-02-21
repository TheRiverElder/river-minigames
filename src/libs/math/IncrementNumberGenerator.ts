import NumberGenerator from "./NumberGenerator";

export default class IncrementNumberGenerator implements NumberGenerator {
    private counter: number;

    constructor(initialValue: number = 0) {
        this.counter = initialValue;
    }

    generate(): number {
        return this.counter++;
    }
}