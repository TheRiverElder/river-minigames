import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Item from "./Item";
import ItemType from "./ItemType";

export default class SimpleItem extends Item {

    static readonly TYPE = new ItemType("simple", (data) => new SimpleItem(data.id));

    readonly id: string;

    override get name(): Text {
        return new I18nText(`item.${this.id}.name`);
    }

    override get description(): Text {
        return new I18nText(`item.${this.id}.description`);
    }

    override get type(): ItemType {
        return SimpleItem.TYPE;
    }

    constructor(id: string, amount: double = 1) {
        super(amount);
        this.id = id;
    }

    override doCopy(): Item {
        return new SimpleItem(this.id);
    }

}