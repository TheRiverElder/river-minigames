import { double } from "../../libs/CommonTypes";
import Item from "./item/Item";
import Profile from "./Profile";

export default class Shop {
    items: Array<Item> = [];

    pricreOf(item: Item): double {
        return 100000;
    }

    buy(item: Item, profile: Profile): boolean {
        const index = this.items.indexOf(item);
        if (index < 0) return false;
        const price = this.pricreOf(item);
        if (profile.account < price) return false;
        profile.account -= price;
        profile.inventory.push(item);
        return true;
    }
}