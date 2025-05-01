import { Values } from "../value/Values";
import GenericMatterType from "./GenericMatterType";

export const Matters = Object.freeze({
    WATER: new GenericMatterType("water", [
        [Values.THERMAL_CONDUCTIVITY, 0.16],
    ]),
    STEEL: new GenericMatterType("steel", [
        [Values.THERMAL_CONDUCTIVITY, 0.58],
    ]),
});