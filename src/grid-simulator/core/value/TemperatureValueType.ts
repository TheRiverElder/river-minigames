import ReactiveObject from "../reaction/ReactiveObject";
import CalculativeValueType from "./CalculativeValueType";
import { Values } from "./Values";

export default class TemperatureValueType extends CalculativeValueType {

    get name(): string {
        return "temperature";
    }
    
    calculate(obj: ReactiveObject): number {
        const heat = obj.getActualValue(Values.HEAT);
        const mass = obj.getCalculatedValue(Values.MASS);
        if (mass === 0) {
            // TODO: Should we throw an error or return a default value?
            return 0;
        }
        return heat / mass;
    }

}