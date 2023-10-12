import { double } from "../../libs/CommonTypes";
import Miner from "./miner/Miner";
import Inventory from "./misc/storage/Inventory";
import Orb from "./orb/Orb";
import Technology from "./technology/Technology";

export default class Profile {
    name: string = "Jack";
    account: double = 0; // 账户余额
    readonly warehouse = new Inventory(); // 总仓库
    readonly miners = new Set<Miner>();
    readonly ownedOrbs = new Set<Orb>();
    readonly unlockedTechnologies = new Set<Technology>();
}