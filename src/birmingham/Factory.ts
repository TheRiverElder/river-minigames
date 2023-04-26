import { int } from "../libs/CommonTypes";
import Industry from "./Industry";
import Player from "./Player";
import ResourceType from "./ResourceType";

export default class Factory {
    readonly industry: Industry;
    readonly owner: Player;
    readonly cost: Map<ResourceType, int>;
    readonly award: Map<ResourceType, int>;
    readonly resourceType: ResourceType;
    resourceAmount: int;
    sold: boolean;

    constructor(
        industry: Industry, 
        owner: Player, 
        cost: Map<ResourceType, int>, 
        award: Map<ResourceType, int>, 
        resourceType: ResourceType, 
        resourceAmount: int, 
        sold: boolean,
    ) {
        this.industry = industry;
        this.owner = owner;
        this.cost = cost;
        this.award = award;
        this.resourceType = resourceType;
        this.resourceAmount = resourceAmount;
        this.sold = sold;
    }

    copy() {
        return new Factory(
            this.industry,
            this.owner, 
            this.cost, 
            this.award, 
            this.resourceType, 
            this.resourceAmount, 
            this.sold,
        );
    }
}