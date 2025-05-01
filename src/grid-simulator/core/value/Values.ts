import HeatValueType from "./HeatValueType";
import MassValueType from "./MassValueType";
import PropertyValueType from "./PropertyValueType";
import TemperatureValueType from "./TemperatureValueType";

export const Values = Object.freeze({
    // Actual values
    HEAT: new HeatValueType(),
    // Calculated values
    MASS: new MassValueType(),
    TEMPERATURE: new TemperatureValueType(),
    // Property values
    THERMAL_CONDUCTIVITY: new PropertyValueType("thermal_conductivity"),
});