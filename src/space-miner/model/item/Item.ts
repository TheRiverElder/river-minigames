import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Profile from "../Profile";
import ItemType from "./ItemType";

export default abstract class Item {

    abstract readonly type: ItemType;

    amount: double = 1;

    constructor(amount: double = 1) {
        this.amount = amount;
    }

    // 等待override
    onUse(profile: Profile, game: Game): void { }
    
    // 等待override
    matches(item: Item): boolean {
        return false;
    }
    
}