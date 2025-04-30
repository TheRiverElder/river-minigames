import Cell from "../grid/Cell";
import ReactiveObject from "../reaction/ReactiveObject";
import ValuePack from "../reaction/ValuePack";

export default class Unit extends ReactiveObject {

    
    constructor(
        public mass: number = 1,
    ) {
        super();
    }

    public tick(cell: Cell): void {
        // do nothing
    }

    public receivePackAt(pack: ValuePack, cell: Cell): void {
        this.receivePack(pack);
    }
}