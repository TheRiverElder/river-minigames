import HeatValueType from "./HeatValueType";
import MassValueType from "./MassValueType";
import TemperatureValueType from "./TemperatureValueType";

export const Values = Object.freeze({
    HEAT: new HeatValueType(),
    MASS: new MassValueType(),
    TEMPERATURE: new TemperatureValueType(),
});