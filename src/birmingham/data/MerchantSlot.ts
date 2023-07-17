import { int, Pair, double } from "../../libs/CommonTypes";
import City from "./City";
import Game from "./Game";

export default class MerchantSlot {
    readonly uid: int;
    readonly position: Pair<double, double>;
    readonly city: City;
    readonly industries: Array<string>;
    bonusBeer: boolean = false;

    constructor(uid: int, position: Pair<double, double>, city: City, industries: Array<string>) {
        this.uid = uid;
        this.position = position;
        this.city = city;
        this.industries = industries;
    }
    
    static load(data: any, game: Game): MerchantSlot {
        const slot = new MerchantSlot(
            data.uid,
            data.position,
            game.cities.getOrThrow(data.city),
            data.industries,
        );
        slot.bonusBeer = data.bonusBeer;
        return slot;
    }

}