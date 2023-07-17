import { Pair, int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { Resource } from "./Constants";

export default class City {
    readonly name: string;
    readonly type: "industry" | "merchant";
    readonly merchantBonus: Nullable<Pair<Resource, int>> = null;

    constructor(name: string, type: "industry" | "merchant", merchantBonus: Nullable<Pair<Resource, int>> = null) {
        this.name = name;
        this.type = type;
        this.merchantBonus = merchantBonus;
    }
    
    static load(data: any): City {
        return new City(
            data.name,
            data.type,
            data.merchantBonus,
        );
    }
}