import Cell from "../grid/Cell";
import { DIRECTIONS } from "../grid/Direction";
import ValuePack from "../reaction/ValuePack";
import ActualValueType from "./ActualValueType";

export default class HeatValueType extends ActualValueType {

    get name(): string {
        return "heat";
    }
    
    tick(cell: Cell): void {
        // 每个tick都会将自己的值的一部分平均分，传递给邻居
        const ratio = 0.05; // 每个tick都传递5%的值
        
        const valueToPass = cell.getActualValue(this) * ratio;
            
        const valuePerNeighbor = valueToPass / 4;

        for (const direction of DIRECTIONS) {
            cell.sendPack(new ValuePack(direction, this, valuePerNeighbor));
        }

        cell.changeActualValue(this, -valueToPass);
    }
    
}