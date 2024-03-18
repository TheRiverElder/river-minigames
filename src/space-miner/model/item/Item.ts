import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text, { TextModel } from "../../../libs/i18n/Text";
import Game from "../../Game";
import { Displayable } from "../../../libs/io/Displayable";
import BasicPersistable from "../io/BasicPersistable";
import { CreativeType } from "../io/CreativeType";
import Profile from "../Profile";

export type ItemType = CreativeType<Item>;

export default abstract class Item implements BasicPersistable<Item>, Displayable<ItemModel> {

    abstract get type(): ItemType;

    readonly game: Game;
    amount: double;

    get name(): string {
        return this.type.id;
    }

    get displayedName(): Text {
        return new I18nText(`item.${this.name}.name`);
    }

    get description(): Text {
        return new I18nText(`item.${this.name}.description`);
    }

    constructor(game: Game, amount: double = 1) {
        this.game = game;
        this.amount = amount;
    }

    getDisplayedModel(): Readonly<ItemModel> {
        return {
            type: this.type.id,
            amount: this.amount,
            name: this.name,
            displayedName: this.displayedName.getDisplayedModel(),
            description: this.description.getDisplayedModel(),
        };
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

    protected doCopy(): Item {
        const data = this.game.itemPersistor.serialize(this, this.game);
        return this.game.itemPersistor.deserialize(data, this.game);
    }

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

    onSerialize(context: Game): any { }

    onDeserialize(data: any, context: Game): void { }

    // UI

    // 等待override
    public getImage(resources: Map<string, string>): string {
        return "";
    }

}

export interface ItemModel {
    readonly type: string;
    readonly amount: double;
    readonly name: string;
    readonly displayedName: TextModel;
    readonly description: TextModel;
};