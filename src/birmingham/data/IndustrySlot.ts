import { int, Pair, double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import City from "./City";
import Factory from "./Factory";
import Game from "./Game";

export default class IndustrySlot {
    readonly uid: int;
    readonly position: Pair<double, double>;
    readonly city: City;
    readonly industries: Array<string>;
    factory: Nullable<Factory> = null;

    constructor(uid: int, position: Pair<double, double>, city: City, industries: Array<string>, factory: Nullable<Factory> = null) {
        this.uid = uid;
        this.position = position;
        this.city = city;
        this.industries = industries;
        this.factory = factory;
    }
    
    static load(data: any, game: Game): IndustrySlot {
        const slot = new IndustrySlot(
            data.uid,
            data.position,
            game.cities.getOrThrow(data.city),
            data.industries,
        );
        slot.factory = data.factory === null ? null : Factory.load(data.factory, game);
        return slot;
    }

}