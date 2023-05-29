import { double } from "../../libs/CommonTypes";
import Inventory from "./Inventory";
import Miner from "./Miner";
import Orb from "./Orb";

export default class Profile {
    name: string = "Jack";
    account: double = 0; // 账户余额
    readonly warehouse = new Inventory(); // 总仓库
    readonly miners = new Set<Miner>();
    readonly ownedOrbs = new Set<Orb>();
}