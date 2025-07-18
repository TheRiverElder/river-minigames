import { clamp } from "lodash";
import Cell from "../grid/Cell";
import { Values } from "../value/Values";
import Unit from "./Unit";
import GenericMatterType from "../matter/GenericMatterType";
import UnitType from "./UnitType";
import { Pair } from "../../../libs/CommonTypes";
import PropertyValueType from "../value/PropertyValueType";

export default class GeneratorUnit extends Unit {

    constructor(
        type: UnitType,
        mass: number,
        public readonly maxEnergyPerTick: number = 1e4, // 每个tick最多转化的能量
        public readonly heatToElectricityRatio: number = 0.3, // 每个tick能把多少热能转化为电能
    ) {
        super(type, mass);

    }


    public tick(cell: Cell): void {
        const previousHeat = cell.getValue(Values.HEAT);
        const deltaEnergy = clamp(previousHeat * this.heatToElectricityRatio, 0, this.maxEnergyPerTick);

        // 转化热能到电能
        cell.grid.energy += deltaEnergy;
    }
}

export interface GeneratorProps {
    readonly mass: number; // 质量
    readonly maxEnergyPerTick: number; // 每个tick最多转化的能量
    readonly heatToElectricityRatio: number; // 每个tick能把多少热能转化为电能
}

export class GeneratorUnitType extends GenericMatterType implements UnitType {

    constructor(
        public readonly name: string,
        public readonly props: GeneratorProps,
        properties?: Array<Pair<PropertyValueType, number>>,
    ) {
        super(name, properties);
    }

    get abbreviation(): string {
        return this.name.split("_").map((s) => s.charAt(0)).join("").toUpperCase();
    }

    create(): Unit {
        return new GeneratorUnit(this, this.props.mass, this.props.maxEnergyPerTick, this.props.heatToElectricityRatio);
    }

} 