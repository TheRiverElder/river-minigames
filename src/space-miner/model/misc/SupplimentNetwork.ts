import { double, Pair } from "../../../libs/CommonTypes";
import ResourceType from "./ResourceType";
import { ResourceTypes } from "./ResourceTypes";
import Facility from "../facility/Facility";
import Inventory from "./storage/Inventory";
import { Displayable, mapModel } from "../../../libs/io/Displayable";
import { ItemModel } from "../item/Item";

export default class SupplimentNetwork implements Displayable<SupplimentNetworkModel> {

    readonly resources: Inventory = new Inventory();
    battery: double = 0;
    liveSupport: double = 0;
    strength: double = 0;

    private batteryMutationRecords: Array<Pair<Facility, double>> = [];
    private liveSupportMutationRecords: Array<Pair<Facility, double>> = [];
    private shieldMutationRecords: Array<Pair<Facility, double>> = [];


    getDisplayedModel(): Readonly<SupplimentNetworkModel> {
        return {
            resources: this.resources.content.map(mapModel),
            battery: this.battery,
            liveSupport: this.liveSupport,
            strength: this.strength,
        };
    }

    getMutationRecordsOf(resourceType: ResourceType): Array<Pair<Facility, double>> {
        switch (resourceType) {
            case ResourceTypes.ELECTRICITY: return this.batteryMutationRecords;
            case ResourceTypes.LIVE_SUPPORT: return this.liveSupportMutationRecords;
            case ResourceTypes.SHIELD: return this.shieldMutationRecords;
            default: return [];
        }
    }

    requireElectricity(amount: double, requirer: Facility): double {
        const delta = Math.min(this.battery, amount);
        this.battery -= delta;
        this.batteryMutationRecords.push([requirer, -delta]);
        return delta;
    }

    requireLiveSupport(amount: double, requirer: Facility): double {
        const delta = Math.min(this.liveSupport, amount);
        this.liveSupport -= delta;
        this.liveSupportMutationRecords.push([requirer, -delta]);
        return delta;
    }

    supplyElectricity(amount: double, supplier: Facility): double {
        const delta = amount;
        this.battery += delta;
        this.batteryMutationRecords.push([supplier, +delta]);
        return delta;
    }

    supplyLiveSupport(amount: double, supplier: Facility): double {
        const delta = amount;
        this.liveSupport += delta;
        this.liveSupportMutationRecords.push([supplier, +delta]);
        return delta;
    }

    supplyStrength(amount: double, supplier: Facility): double {
        const delta = amount;
        this.strength += delta;
        this.shieldMutationRecords.push([supplier, +delta]);
        return delta;
    }

    private batteryReadyToConsume: double = 0;
    private liveSupportReadyToConsume: double = 0;
    private shieldReadyToConsume: double = 0;

    preTick() {
        this.batteryReadyToConsume = this.battery;
        this.liveSupportReadyToConsume = this.liveSupport;
        this.shieldReadyToConsume = this.strength;
        this.batteryMutationRecords = [];
        this.liveSupportMutationRecords = [];
        this.shieldMutationRecords = [];
    }

    tick() { }

    postTick() {
        this.battery = Math.max(0, this.battery - this.batteryReadyToConsume);
        this.liveSupport = Math.max(0, this.liveSupport - this.liveSupportReadyToConsume);
        this.strength = Math.max(0, this.strength - this.shieldReadyToConsume);
    }
}

export type SupplimentNetworkModel = Readonly<{
    resources: Array<ItemModel>;
    battery: double;
    liveSupport: double;
    strength: double;
}>;