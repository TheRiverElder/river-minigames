import Vector2 from "../libs/math/Vector2";
import Factory from "./Factory";

export default class FactorySlot {
    readonly position: Vector2;
    readonly factories: Array<Factory>;

    constructor(position: Vector2, factories: Iterable<Factory>) {
        this.position = position;
        this.factories = Array.from(factories);
    }
}