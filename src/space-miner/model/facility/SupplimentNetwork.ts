import { double } from "../../../libs/CommonTypes";
import Inventory from "../Inventory";

export default class SupplimentNetwork {

    resources: Inventory = new Inventory();
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
    
    preTick() {
        this.battery = 0;
        this.liveSupport = 0;
    }
}