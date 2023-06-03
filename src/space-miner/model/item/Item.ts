import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Profile from "../Profile";
import ItemType from "./ItemType";

export default abstract class Item {

    abstract get type(): ItemType;

    amount: double;

    get name(): Text {
        return new I18nText(`item.${this.type.name}.name`);
    }

    get description(): Text {
        return new I18nText(`item.${this.type.name}.description`, this);
    }

    constructor(amount: double = 1) {
        this.amount = amount;
    }

    // 等待override
    onUse(profile: Profile, game: Game): boolean { return false }
    
    // 等待override
    matches(item: Item): boolean {
        return false;
    }

    // 等待override
    abstract doCopy(): Item;
    
    copy(amount?: double): Item {
        const item = this.doCopy();
        item.amount = (typeof amount === "number") ? amount : 1;
        return item;
    }

    // UI

    // 等待override
    public get image(): string {
        return "";
    }
    
}