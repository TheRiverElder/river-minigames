import { double } from "../../libs/CommonTypes";
import { sumBy } from "../../libs/lang/Collections";
import Item from "./item/Item";

export default class Inventory {

    readonly items = new Array<Item>();

    add(item: Item) {
        const matchedItem = this.items.find(item => item.matches(item));
        if (matchedItem) {
            matchedItem.amount += item.amount;
        } else {
            this.items.push(item);
        }
    }

    remove(item: Item): Item {
        const matchedItem = this.items.find(item => item.matches(item));
        if (matchedItem) {
            const amount = Math.min(matchedItem.amount, item.amount);
            matchedItem.amount -= amount;
            return matchedItem.copy(amount);
        } else {
            return item.copy(0);
        }
    }

    clear() {
        this.items.splice(0, this.items.length);
    }

    get total(): double {
        return sumBy(this.items, it => it.amount);
    }

    
}