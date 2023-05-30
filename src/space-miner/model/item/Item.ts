import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Profile from "../Profile";
import ItemType from "./ItemType";

export default abstract class Item {

    abstract get type(): ItemType;

    amount: double;

    constructor(amount: double = 1) {
        this.amount = amount;
    }

    // 等待override
    onUse(profile: Profile, game: Game): void { }
    
    // 等待override
    matches(item: Item): boolean {
        return false;
    }

    // 等待override
    copy(amount?: double): Item {
        throw new Error("Forbidden to copy");
    }

    // UI

    // 等待override
    public get image(): string {
        return "";
    }
    
}