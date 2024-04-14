import { double } from "../../../libs/CommonTypes";
import { createArray } from "../../../libs/lang/Collections";
import { rand, randInt, randOne } from "../../../libs/math/Mathmatics";
import Game from "../global/Game";
import Profile from "../global/Profile";
import { ARTIFICIAL_RESOURCE_TYPES } from "../misc/ResourceTypes";
import Item, { ItemType } from "./Item";
import ResourceItem from "./ResourceItem";
import { cleanUpItems } from "../misc/storage/SimpleStorage";
import { CreativeType } from "../io/CreativeType";

export default class BonusPackItem extends Item {

    static readonly TYPE = new CreativeType<Item>("bonus_pack", (type, game, data) => new BonusPackItem(game));

    override get type(): ItemType {
        return BonusPackItem.TYPE;
    }

    constructor(game: Game, amount?: double) {
        super(game, amount);
    }

    override matches(item: Item): boolean {
        return item instanceof BonusPackItem;
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
            () => new ResourceItem(game, randOne(ARTIFICIAL_RESOURCE_TYPES), rand(5, 30))
        ));
        profile.warehouse.addAll(bonus);
        return true;
    }
    
}