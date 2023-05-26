import { double } from "../../libs/CommonTypes";
import Inventory from "./Inventory";

export default class Profile {
    name: string = "Jack";
    account: double = 0; // 账户余额
    inventory = new Inventory();
}