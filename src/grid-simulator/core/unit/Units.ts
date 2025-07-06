import { Values } from "../value/Values";
import { FossilFuelUnitType } from "./FossilFuelUnit";

export const Units = Object.freeze({
    COAL: new FossilFuelUnitType("coal", {
        mass: 500,
        burnSpeed: 0.1,
        calorificValue: 1e5,
    }, [
        [Values.THERMAL_CONDUCTIVITY, 0.05],
    ]),
});