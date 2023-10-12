import { double, Pair } from "../../../libs/CommonTypes";
import ResourceType from "./ResourceType";
import { ResourceTypes } from "./ResourceTypes";
import Facility from "../facility/Facility";
import Inventory from "./storage/Inventory";

export default class SupplimentNetwork {

    readonly resources: Inventory = new Inventory();
    battery: double = 0;
    liveSupport: double = 0;

    private batteryMutationRecords: Array<Pair<Facility, double>> = [];
    private liveSupportMutationRecords: Array<Pair<Facility, double>> = [];

    getMutationRecordsOf(resourceType: ResourceType): Array<Pair<Facility, double>> {
        switch (resourceType) {
            case ResourceTypes.ELECTRUCITY: return this.batteryMutationRecords;
            case ResourceTypes.LIVE_SUPPORT: return this.liveSupportMutationRecords;
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

    private batteryReadyToConsume: double = 0;
    private liveSupportReadyToConsume: double = 0;

    preTick() {
        this.batteryReadyToConsume = this.battery;
        this.liveSupportReadyToConsume = this.liveSupport;
        this.batteryMutationRecords = [];
        this.liveSupportMutationRecords = [];
    }

    tick() { }

    postTick() {
        this.battery = Math.max(0, this.battery - this.batteryReadyToConsume);
        this.liveSupport = Math.max(0, this.liveSupport - this.liveSupportReadyToConsume);
    }
}