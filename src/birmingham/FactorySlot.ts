import { int } from "../libs/CommonTypes";
import Vector2 from "../libs/math/Vector2";
import Factory from "./Factory";
import Industry from "./Industry";
import Player from "./Player";
import ResourceType from "./ResourceType";

export default class FactorySlot {
    readonly industry: Industry;
    readonly owner: Player;
    readonly cost: Map<ResourceType, int>;
    readonly award: Map<ResourceType, int>;
    readonly position: Vector2;
    readonly factories: Array<Factory>;

    constructor(
        industry: Industry, 
        owner: Player, 
        cost: Map<ResourceType, int>, 
        award: Map<ResourceType, int>, 
        position: Vector2, 
        factories: Iterable<Factory>,
    ) {
        this.industry = industry;
        this.owner = owner;
        this.cost = cost;
        this.award = award;
        this.industry = industry;
        this.position = position;
        this.factories = Array.from(factories);
    }
}