import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import { InOrbLocation } from "../orb/Orb";

export default abstract class Facility {
    location: Nullable<InOrbLocation> = null;

    abstract tick(game: Game): void;
}