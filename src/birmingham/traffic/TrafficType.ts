import { int } from "../../libs/CommonTypes";
import ResourceType, { RESOURCE_TYPE_BEER, RESOURCE_TYPE_COAL, RESOURCE_TYPE_COIN } from "../ResourceType";

export class TrafficType {
    readonly name: string;
    readonly costsByAmount: Array<Map<ResourceType, int>>;

    constructor(name: string, costsByAmount: Array<Map<ResourceType, int>>) {
        this.name = name;
        this.costsByAmount = Array.from(costsByAmount);
    }

    canBuild(amount: int) {
        return amount > 0 && amount <= this.costsByAmount.length;
    }

    getCost(amount: int): Map<ResourceType, int> {
        const cost = this.costsByAmount[amount - 1];
        if (!cost)  throw new Error("不能建造！");
        return cost;
    }

}


export const TRAFFIC_TYPE_CANAL = new TrafficType("运河", [
    new Map([
        [RESOURCE_TYPE_COIN, 3],
    ]),
]);
export const TRAFFIC_TYPE_RAIL = new TrafficType("铁路", [
    new Map([
        [RESOURCE_TYPE_COIN, 5],
        [RESOURCE_TYPE_COAL, 1],
    ]),
    new Map([
        [RESOURCE_TYPE_COIN, 15],
        [RESOURCE_TYPE_COAL, 2],
        [RESOURCE_TYPE_BEER, 1],
    ]),
]);