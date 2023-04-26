import { Nullable } from "../libs/lang/Optional";
import Factory from "./Factory";
import Industry from "./Industry";

export default class IndustrySlot {
    readonly industries: Set<Industry>;
    factory: Nullable<Factory> = null;

    constructor(industries: Iterable<Industry>) {
        this.industries = new Set(industries);
    }
}