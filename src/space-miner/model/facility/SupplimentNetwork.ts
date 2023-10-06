import { double } from "../../../libs/CommonTypes";
import Inventory from "../Inventory";

export default class SupplimentNetwork {

    readonly resources: Inventory = new Inventory();
    battery: double = 0;
    liveSupport: double = 0;

    requireElectricity(amount: double): double {
        const delta = Math.min(this.battery, amount);
        this.battery -= delta;
        return delta;
    }

    requireLiveSupport(amount: double): double {
        const delta = Math.min(this.liveSupport, amount);
        this.liveSupport -= delta;
        return delta;
    }

    private batteryReadyToConsume: double = 0;
    private liveSupportReadyToConsume: double = 0;

    preTick() {
        this.batteryReadyToConsume = this.battery;
        this.liveSupportReadyToConsume = this.liveSupport;
    }

    tick() { }

    postTick() {
        this.battery = Math.max(0, this.battery - this.batteryReadyToConsume);
        this.liveSupport = Math.max(0, this.liveSupport - this.liveSupportReadyToConsume);
    }
}