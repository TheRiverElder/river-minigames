import { int } from "../libs/CommonTypes";
import ResourceType, { RESOURCE_TYPE_COAL as RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON } from "./ResourceType";

export default class Market {

    readonly resourceType: ResourceType;
    readonly capacityLevel: int;
    amount: int;

    constructor(resourceType: ResourceType, capacityLevel: int, amount: int) {
        this.resourceType = resourceType;
        this.capacityLevel = capacityLevel;
        this.amount = amount;
    }

    getCapacity() {
        return (this.capacityLevel - 1) * 2;
    }

    getNextPrice() {
        return this.capacityLevel - Math.ceil(this.amount / 2);
    }

    getNextPayback() {
        return this.capacityLevel - Math.ceil((this.amount + 1) / 2);
    }

    // 返回所需的金钱
    take(amount: int): int {
        let price = 0;
        for (let i = 0; i < amount; i++) {
            if (this.amount > 0) {
                price += this.getNextPrice();
                this.amount--;
            } else {
                price += this.capacityLevel;
            }
        }
        return price;
    }

    // 返回[没卖出的资源数量, 所得的金钱]
    put(amount: int): [int, int] {
        let payback = 0;
        let rest = amount;
        for (let i = 0; i < amount && this.amount < this.getCapacity(); i++) {
            payback += this.getNextPayback();
            this.amount++;
            rest--;
        }
        return [rest, payback];
    }

}

export function createCoalMarket() {
    return new Market(RESOURCE_TYPE_COAL, 8, 13);
}

export function createSteelMarket() {
    return new Market(RESOURCE_TYPE_IRON, 6, 8);
}