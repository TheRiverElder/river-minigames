import { double } from "../../../libs/CommonTypes";
import { createArray } from "../../../libs/lang/Collections";
import { rand, randInt, randOne } from "../../../libs/math/Mathmatics";
import Game from "../../Game";
import Profile from "../Profile";
import { ARTIFICIAL_RESOURCE_TYPES } from "../misc/ResourceTypes";
import Item from "./Item";
import ItemType from "./ItemType";
import ResourceItem from "./ResourceItem";
import { cleanUpItems } from "../misc/storage/SimpleStorage";

export default class BonusPackItem extends Item {

    static readonly TYPE = new ItemType("bonus_pack", () => new BonusPackItem());

    override get type(): ItemType {
        return BonusPackItem.TYPE;
    }

    constructor(amount?: double) {
        super(amount);
    }

    override matches(item: Item): boolean {
        return item instanceof BonusPackItem;
    }

    override doCopy(amount?: double): Item {
        return new BonusPackItem(amount);
    }

    public override getImage(resources: Map<string, string>): string {
        return resources.get(`item.${this.name}`) || "";
    }

    override canUse(profile: Profile, game: Game): boolean {
        return true;
    }

    override onUse(profile: Profile, game: Game): boolean {
        if (this.amount <= 0) return false;
        const amount = this.amount;
        this.amount = 0;
        const bonus = cleanUpItems(createArray(Math.max(0, Math.round(randInt(1, 5) * amount)), 
            () => new ResourceItem(randOne(ARTIFICIAL_RESOURCE_TYPES), rand(5, 30))
        ));
        profile.warehouse.addAll(bonus);
        return true;
    }
    
}