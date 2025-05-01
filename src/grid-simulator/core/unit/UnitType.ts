import MatterType from "../matter/MatterType";
import Unit from "./Unit";

export default interface UnitType extends MatterType {

    get abbreviation(): string;

    create(): Unit;
}