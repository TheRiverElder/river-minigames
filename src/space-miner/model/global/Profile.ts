import { double, int } from "../../../libs/CommonTypes";
import { mapModel } from "../../../libs/io/Displayable";
import Contract from "../contract/Contract";
import { ItemModel } from "../item/Item";
import Miner from "../miner/Miner";
import Inventory from "../misc/storage/Inventory";
import Orb from "../orb/Orb";
import Technology from "../technology/Technology";

export default class Profile {
    readonly warehouse = new Inventory(); // 总仓库
    readonly miners = new Set<Miner>();
    readonly ownedOrbs = new Set<Orb>();
    readonly unlockedTechnologies = new Set<Technology>();
    readonly contracts = new Set<Contract>();

    constructor(
        public readonly uid: int,
        public name: string = "Jack",
        public account: double = 0, // 账户余额
    ) {

    }

    getDisplayedModel(): ProfileModel {
        return {
            name: this.name,
            account: this.account,
            warehouse: this.warehouse.content.map(mapModel),
            ownedOrbs: Array.from(this.ownedOrbs).map(it => it.uid),
        };
    }
}

export type ProfileModel = Readonly<{
    name: string;
    account: double;
    warehouse: Array<ItemModel>;
    // miners :Array<Miner>();
    ownedOrbs: Array<int>;
    // unlockedTechnologies = new Set<Technology>();
}>;