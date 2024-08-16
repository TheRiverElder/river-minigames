import { double, Pair } from "../../../libs/CommonTypes";
import ResourceType from "./ResourceType";
import { ResourceTypes } from "./ResourceTypes";
import Facility from "../facility/Facility";
import Inventory from "./storage/Inventory";
import { Displayable, mapModel } from "../../../libs/io/Displayable";
import { ItemModel } from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import Game from "../global/Game";

export default class SupplimentNetwork implements Displayable<SupplimentNetworkModel> {

    readonly resources: Inventory = new Inventory();
    readonly nonPersistableResources: Inventory = new Inventory();
    // battery: double = 0;
    // liveSupport: double = 0;
    // strength: double = 0;

    // private batteryMutationRecords: Array<Pair<Facility, double>> = [];
    // private liveSupportMutationRecords: Array<Pair<Facility, double>> = [];
    // private shieldMutationRecords: Array<Pair<Facility, double>> = [];

    constructor(
        public readonly game: Game,
    ) { }


    getDisplayedModel(): Readonly<SupplimentNetworkModel> {
        return {
            resources: this.resources.content.map(mapModel),
            nonPersistableResources: this.nonPersistableResources.content.map(mapModel),
            // battery: this.battery,
            // liveSupport: this.liveSupport,
            // strength: this.strength,
        };
    }

    getMutationRecordsOf(resourceType: ResourceType): Array<Pair<Facility, double>> {
        switch (resourceType) {
            case ResourceTypes.ELECTRICITY: return [];
            case ResourceTypes.LIVE_SUPPORT: return [];
            case ResourceTypes.SHIELD: return [];
            default: return [];
        }
    }

    requireElectricity(amount: double, requirer: Facility): double {
        const delta = this.nonPersistableResources.remove(new ResourceItem(this.game, ResourceTypes.ELECTRICITY, amount)).amount;
        // this.batteryMutationRecords.push([requirer, -delta]);
        return delta;
    }

    requireLiveSupport(amount: double, requirer: Facility): double {
        const delta = this.nonPersistableResources.remove(new ResourceItem(this.game, ResourceTypes.LIVE_SUPPORT, amount)).amount;
        // this.liveSupportMutationRecords.push([requirer, -delta]);
        return delta;
    }

    supplyElectricity(amount: double, supplier: Facility): double {
        this.nonPersistableResources.add(new ResourceItem(this.game, ResourceTypes.ELECTRICITY, amount));
        // this.batteryMutationRecords.push([supplier, +delta]);
        return amount;
    }

    supplyLiveSupport(amount: double, supplier: Facility): double {
        this.nonPersistableResources.add(new ResourceItem(this.game, ResourceTypes.LIVE_SUPPORT, amount));
        // this.liveSupportMutationRecords.push([supplier, +delta]);
        return amount;
    }

    supplyStrength(amount: double, supplier: Facility): double {
        this.nonPersistableResources.add(new ResourceItem(this.game, ResourceTypes.STRENGTH, amount));
        // this.shieldMutationRecords.push([supplier, +delta]);
        return amount;
    }

    private batteryReadyToConsume: double = 0;
    private liveSupportReadyToConsume: double = 0;
    private shieldReadyToConsume: double = 0;

    preTick() {
        // this.batteryReadyToConsume = this.battery;
        // this.liveSupportReadyToConsume = this.liveSupport;
        // this.shieldReadyToConsume = this.strength;
        // this.batteryMutationRecords = [];
        // this.liveSupportMutationRecords = [];
        // this.shieldMutationRecords = [];
    }

    tick() { }

    postTick() {
        // this.battery = Math.max(0, this.battery - this.batteryReadyToConsume);
        // this.liveSupport = Math.max(0, this.liveSupport - this.liveSupportReadyToConsume);
        // this.strength = Math.max(0, this.strength - this.shieldReadyToConsume);
        this.nonPersistableResources.clear();

        const money = this.resources.remove(new ResourceItem(this.game, ResourceTypes.MONEY, Number.POSITIVE_INFINITY));
        this.game.profile.account += money.amount;
    }
}

export type SupplimentNetworkModel = Readonly<{
    resources: Array<ItemModel>;
    nonPersistableResources: Array<ItemModel>;
    // battery: double;
    // liveSupport: double;
    // strength: double;
}>;