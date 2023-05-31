import { double, int, Pair } from "../../libs/CommonTypes";
import { sumBy } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Item from "./item/Item";

export default class Inventory {

    readonly items = new Array<Item>();

    add(newItem: Item) {
        const matchedItem = this.items.find(item => item.matches(newItem));
        if (matchedItem) {
            matchedItem.amount += newItem.amount;
        } else {
            this.items.push(newItem);
        }
    }

    // 会尽可能移除物品，哪怕不够
    remove(query: Item): Item {
        let counter = 0;
        let index = 0;
        while (counter < query.amount && index < this.items.length) {
            const item = this.items[index];
            if (item.matches(query)) {
                const amount = Math.min(item.amount, query.amount - counter);
                item.amount -= amount;
                counter += amount;
                if (item.amount <= 0) this.items.splice(index, 1);
                else index++;
            } else index++;
        }
        return query.copy(counter);
    }

    // 移除确切数量，否则不移除
    removeExact(query: Item): Item {
        const records: Array<Pair<int, double>> = [];
        let counter = 0;
        let index = 0;
        while (counter < query.amount && index < this.items.length) {
            const item = this.items[index];
            if (item.matches(query)) {
                const amount = Math.min(item.amount, query.amount - counter);
                records.push([index, amount]);
                counter += amount;
            }

            index++;
        }

        if (counter < query.amount) return query.copy(0);

        for (let recordIndex = records.length - 1; recordIndex >= 0; recordIndex--) {
            const [index, amount] = records[recordIndex];
            const item = this.items[index];
            item.amount -= amount;
            if (item.amount <= 0) this.items.splice(index, 1);
        }

        return query.copy(counter);
    }

    // 所有的都移除确切数量，否则全部不移除
    removeExactAll(queries: Array<Item>): Array<Item> {
        const totalRecords: Array<Pair<Item, Array<Pair<int, double>>>> = [];
        for (const query of queries) {
            const records: Array<Pair<int, double>> = [];
            let counter = 0;
            let index = 0;
            while (counter < query.amount && index < this.items.length) {
                const item = this.items[index];
                if (item.matches(query)) {
                    const amount = Math.min(item.amount, query.amount - counter);
                    records.push([index, amount]);
                    counter += amount;
                }
    
                index++;
            }

            if (counter < query.amount) return [];

            totalRecords.push([query, records]);
        }
        
        const result: Array<Item> = [];
        for (const [query, records] of totalRecords) {
            let counter = 0;
            for (let recordIndex = records.length - 1; recordIndex >= 0; recordIndex--) {
                const [index, amount] = records[recordIndex];
                const item = this.items[index];
                item.amount -= amount;
                counter += amount;
            }
            result.push(query.copy(counter));
        }

        this.cleanUp();

        return result;
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