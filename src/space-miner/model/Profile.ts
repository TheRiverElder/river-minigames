import { double } from "../../libs/CommonTypes";
import Inventory from "./Inventory";
import Item from "./item/Item";
import Miner from "./Miner";
import Orb from "./Orb";

export default class Profile {
    name: string = "Jack";
    account: double = 0; // 账户余额
    warehouse = new Inventory();
    inventory = new Array<Item>();
    miners = new Set<Miner>();
    orbs = new Set<Orb>();
}