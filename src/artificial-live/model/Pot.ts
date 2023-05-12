
import { Nullable } from "../../libs/lang/Optional";
import Bion from "./Bion";
import BionEnvironment from "./BionEnvironment";

export default class Pot {
    environment: Nullable<BionEnvironment> = null;
    bion: Nullable<Bion> = null;
}