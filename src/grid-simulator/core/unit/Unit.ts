import Cell from "../grid/Cell";
import ReactiveObject from "../reaction/ReactiveObject";
import ValuePack from "../reaction/ValuePack";
import UnitType from "./UnitType";

export default abstract class Unit extends ReactiveObject {

    
    constructor(
        public readonly type: UnitType,
        public mass: number = 1,
    ) {
        super();
    }

    public tick(cell: Cell): void { }

    public receivePackAt(pack: ValuePack, cell: Cell): ValuePack | null {
        return pack;
    }
}