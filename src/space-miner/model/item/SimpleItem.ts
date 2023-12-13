import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import { CreativeType } from "../io/CreativeType";
import Item, { ItemType } from "./Item";

export default class SimpleItem extends Item {

    static readonly TYPE = new CreativeType("simple", (game, data) => new SimpleItem(game, data.id));

    readonly id: string;

    override get type(): ItemType {
        return SimpleItem.TYPE;
    }

    override get displayedName(): Text {
        return new I18nText(`item.${this.id}.name`);
    }

    override get description(): Text {
        return new I18nText(`item.${this.id}.description`);
    }

    constructor(game: Game, id: string, amount: double = 1) {
        super(game, amount);
        this.id = id;
    }

}