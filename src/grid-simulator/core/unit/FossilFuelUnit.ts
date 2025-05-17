import { Pair } from "../../../libs/CommonTypes";
import Cell from "../grid/Cell";
import GenericMatterType from "../matter/GenericMatterType";
import PropertyValueType from "../value/PropertyValueType";
import { Values } from "../value/Values";
import Unit from "./Unit";
import UnitType from "./UnitType";

export default class FossilFuelUnit extends Unit {

    constructor(
        type: UnitType,
        mass: number,
        public readonly burnSpeed: number, // 燃烧速度
        public readonly calorificValue: number, // 热值
    ) {
        super(type, mass);
    }

    public tick(cell: Cell): void {
        const cost = Math.min(this.mass, this.burnSpeed);
        this.mass -= cost;
        cell.changeActualValue(Values.HEAT, cost * this.calorificValue);
    }
}

export interface FossilFuelProps {
    readonly mass: number; // 质量
    readonly burnSpeed: number; // 燃烧速度
    readonly calorificValue: number; // 热值
}

export class FossilFuelUnitType extends GenericMatterType implements UnitType {

    constructor(
        public readonly name: string,
        public readonly props: FossilFuelProps,
        properties?: Array<Pair<PropertyValueType, number>>,
    ) { 
        super(name, properties);
    }

    get abbreviation(): string {
        return this.name.split("_").map((s) => s.charAt(0)).join("").toUpperCase();
    }

    create(): Unit {
        return new FossilFuelUnit(this, this.props.mass, this.props.burnSpeed, this.props.calorificValue);
    }

} 