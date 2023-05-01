import { filterNotNull } from "../libs/lang/Collections";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import Factory from "./Factory";
import Industry from "./Industry";
import IndustrySlot from "./IndustrySlot";
import Market from "./Market";
import ResourceType from "./ResourceType";
import Traffic from "./traffic/Traffic";

export default class City {
    readonly name: string;
    readonly centerPosition: Vector2;
    readonly industrySlots: Array<IndustrySlot>;
    readonly traffics: Set<Traffic>;
    readonly market: Nullable<Market>;

    constructor(name: string, centerPosition: Vector2, industrySlots: Iterable<IndustrySlot>, traffics: Iterable<Traffic>, market: Nullable<Market>) {
        this.name = name;
        this.centerPosition = centerPosition;
        this.industrySlots = Array.from(industrySlots);
        this.traffics = new Set(traffics);
        this.market = market;
    }

    canAcceptIndustry(industry: Industry) {
        return this.industrySlots.some(slot => slot.industries.has(industry));
    }

    canAcceptCity(city: City) {
        return city === this || city === CITY_WILD;
    }


    getFactoryWithResource(resourceType: ResourceType): Nullable<Factory> {
        const factories = filterNotNull(this.industrySlots.map(it => it.factory));
        if (factories.length === 0) return null;
        return factories.find(factory => factory.belongingSlot.resourceType === resourceType) || null;
    }

    getMarket(resourceType: ResourceType): Nullable<Market> {
        if (this.market && this.market.resourceType === resourceType) return this.market;
        else return null;
    }

}

export const CITY_EMPTY = new City("", Vector2.ZERO, [], [], null);
export const CITY_WILD = new City("Wild", Vector2.ZERO, [], [], null);