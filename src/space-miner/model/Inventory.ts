import { double, int, Pair } from "../../libs/CommonTypes";
import { sumBy } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
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

    // 去除amount为0的物品，堆叠可堆叠物品
    cleanUp() {
        const items = this.items;
        for (let index = 0; index < items.length;) {
            const item = items[index];
            if (item.amount <= 0) {
                items.splice(index, 1);
                continue;
            }

            let alreadyExistingItem: Nullable<Item> = null;
            for (let j = 0; j < index; j++) {
                const matcher = items[j];
                if (!matcher.matches(item)) continue; 
                alreadyExistingItem = matcher;
                break;
            }
            if (alreadyExistingItem) {
                items.splice(index, 1);
                alreadyExistingItem.amount += item.amount;
                continue;
            }
            
            index++;
        }
    }

    findMatched(item: Item): Nullable<Pair<int, Item>> {
        for (let index = 0; index < this.items.length; index++) {
            const matcher = this.items[index];
            if (matcher.matches(item)) return [index, matcher];
        }
        return null;
    }

    get total(): double {
        return sumBy(this.items, it => it.amount);
    }

    
}