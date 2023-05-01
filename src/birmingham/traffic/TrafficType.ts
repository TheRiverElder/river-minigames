import { int } from "../../libs/CommonTypes";
import ResourceType from "../ResourceType";

export class TrafficType {
    readonly name: string;
    readonly era: int;
    readonly costsByAmount: Array<Array<[ResourceType, int]>>;

    constructor(name: string, era: int, costsByAmount: Array<Array<[ResourceType, int]>>) {
        this.name = name;
        this.era = era;
        this.costsByAmount = Array.from(costsByAmount);
    }

    canBuild(amount: int) {
        return amount > 0 && amount <= this.costsByAmount.length;
    }

    getCost(amount: int): Array<[ResourceType, int]> {
        const cost = this.costsByAmount[amount - 1];
        if (!cost)  throw new Error("不能建造！");
        return cost;
    }

}