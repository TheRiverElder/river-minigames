import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Profile from "../Profile";
import ItemType from "./ItemType";

export default abstract class Item {

    abstract get type(): ItemType;

    amount: double;

    get name(): string {
        return this.type.name;
    }

    get displayedName(): Text {
        return new I18nText(`item.${this.type.name}.name`);
    }

    get description(): Text {
        return new I18nText(`item.${this.type.name}.description`, this);
    }

    constructor(amount: double = 1) {
        this.amount = amount;
    }

    // 等待override
    canUse(profile: Profile, game: Game): boolean { return false }

    // 等待override
    onUse(profile: Profile, game: Game): boolean { return false }
    
    // 等待override
    // 如果为true则代表：可以被堆叠，可以被取出
    matches(item: Item): boolean {
        return false;
    }

    hasTag(tag: string): boolean {
        return false;
    }

    // 等待override
    protected abstract doCopy(): Item;
    
    copy(amount?: double): Item {
        const item = this.doCopy();
        item.amount = (typeof amount === "number") ? amount : 1;
        return item;
    }
    
    copyWithAmount(): Item {
        const item = this.doCopy();
        item.amount = this.amount;
        return item;
    }
    
    take(amount: double = 1): Item {
        const actualAmount = Math.min(this.amount, amount);
        this.amount -= actualAmount;
        return this.copy(actualAmount);
    }

    // UI

    // 等待override
    public getImage(resources: Map<string, string>): string {
        return "";
    }
    
}