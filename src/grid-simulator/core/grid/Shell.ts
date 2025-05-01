import { sum } from "lodash";
import MatterType from "../matter/MatterType";
import ReactiveObject from "../reaction/ReactiveObject";
import PropertyValueType from "../value/PropertyValueType";
import { Pair } from "../../../libs/CommonTypes";

export default class Shell extends ReactiveObject {

    private readonly matters: Map<MatterType, number>;

    constructor(matters?: Array<Pair<MatterType, number>>) {
        super();
        this.matters = new Map(matters);
    }

    get mass(): number {
        return sum([...this.matters.values()]);
    }

    changeMatter(matter: MatterType, delta: number): void {
        this.matters.set(matter, (this.matters.get(matter) ?? 0) + delta);
    }

    hasMatter(type: MatterType): boolean {
        return this.matters.has(type) && this.matters.get(type)! > 0;
    }

    getMatter(type: MatterType): number {
        return this.matters.get(type) ?? 0;
    }

    override getPropertyValue(key: PropertyValueType): number {
        let mass = 0;
        let s = 0;
        for (const [type, amount] of this.matters.entries()) {
            mass += amount;
            s += type.getPropertyValue(key) * amount;
        }
        return s / mass;
    }

}