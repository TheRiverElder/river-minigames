import { Values } from "../value/Values";
import { FossilFuelUnitType } from "./FossilFuelUnit";
import { GeneratorUnitType } from "./GeneratorUnit";

export const Units = Object.freeze({
    COAL: new FossilFuelUnitType("coal", {
        mass: 500,
        burnSpeed: 0.1,
        calorificValue: 1e5,
    }, [
        [Values.THERMAL_CONDUCTIVITY, 0.05],
    ]),

    THERMAL_GENERATOR: new GeneratorUnitType("thermal_generator", {
        mass: 500,
        maxEnergyPerTick: 1e4,
        heatToElectricityRatio:0.3,
    }, [
        [Values.THERMAL_CONDUCTIVITY, 0.32],
    ])
});