import { Nullable } from "../libs/lang/Optional";
import Registry from "../libs/management/Registry";
import GameObject from "./GameObject";

export default class TableBottomSimulator {

    readonly behaviorTypes = new Registry<string, any>(type => type.name);

    root: Nullable<GameObject> = null;

}