
import { double, Pair, int } from "../../../../libs/CommonTypes";
import { sumBy } from "../../../../libs/lang/Collections";
import { Nullable } from "../../../../libs/lang/Optional";
import Item from "../../item/Item";
import Storage from "./Storage";

export default abstract class SimpleStorage implements Storage {

    private readonly items: Array<Item>;

    constructor(items: Array<Item> = []) {
        this.items = items;
    }

    abstract get capacity(): double;

    get total(): double {
        return sumBy(this.items, it => it.amount);
    }

    get full(): boolean {
        if (this.capacity > 0 && !Number.isFinite(this.capacity)) return false;
        return this.total >= this.capacity;
    }

    get empty(): boolean {
        return this.items.every(it => it.amount <= 0);
    }

    get content(): Array<Item> {
        return this.items;
    }

    add(newItem: Item): number {
        if (newItem.amount <= 0) return 0;
        const remainedSpace = Math.max(0, this.capacity - this.total);
        const amount = Math.min(remainedSpace, newItem.amount);
        const matchedItem = this.items.find(item => item.matches(newItem));
        if (matchedItem) {
            matchedItem.amount += amount;
        } else {
            this.items.push(newItem.copy(amount));
        }
        return newItem.amount - amount;
    }

    addAll(newItems: Array<Item>): Array<Item> {
        const rest: Array<Item> = [];
        for (const item of newItems) {
            const restAmount = this.add(item);
            if (restAmount > 0) rest.push(item.copy(restAmount));
        }
        return rest;
    }

    remove(queryItem: Item): Item {
        let counter = 0;
        let index = 0;
        while (counter < queryItem.amount && index < this.items.length) {
            const item = this.items[index];
            if (item.matches(queryItem)) {
                const amount = Math.min(item.amount, queryItem.amount - counter);
                item.amount -= amount;
                counter += amount;
                if (item.amount <= 0) this.items.splice(index, 1);
                else index++;
            } else index++;
        }
        return queryItem.copy(counter);
    }

    removeAll(queryItems: Array<Item>): Array<Item> {
        const result: Array<Item> = [];
        for (const queryItem of queryItems) {
            result.push(this.remove(queryItem));
        }
        return result;
    }

    removeExact(queryItem: Item): Item {
        const records: Array<Pair<int, double>> = [];
        let counter = 0;
        let index = 0;
        while (counter < queryItem.amount && index < this.items.length) {
            const item = this.items[index];
            if (item.matches(queryItem)) {
                const amount = Math.min(item.amount, queryItem.amount - counter);
                records.push([index, amount]);
                counter += amount;
            }

            index++;
        }

        if (counter < queryItem.amount) return queryItem.copy(0);

        for (let recordIndex = records.length - 1; recordIndex >= 0; recordIndex--) {
            const [index, amount] = records[recordIndex];
            const item = this.items[index];
            item.amount -= amount;
            if (item.amount <= 0) this.items.splice(index, 1);
        }

        return queryItem.copy(counter);
    }

    removeExactAll(queryItems: Array<Item>): Array<Item> {
        const totalRecords: Array<Pair<Item, Array<Pair<int, double>>>> = [];
        for (const query of queryItems) {
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

    clear(): Array<Item> {
        return this.items.splice(0, this.items.length);
    }

    cleanUp(): void {
        cleanUpItems(this.items);
    }

    findMatched(item: Item): Nullable<Pair<number, Item>> {
        for (let index = 0; index < this.items.length; index++) {
            const matcher = this.items[index];
            if (matcher.matches(item)) return [index, matcher];
        }
        return null;
    }

}

export function cleanUpItems(items: Array<Item>): Array<Item> {
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
    return items;
}