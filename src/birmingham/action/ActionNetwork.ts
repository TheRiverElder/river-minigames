import Card from "../Card";
import City from "../City";
import Traffic from "../traffic/Traffic";
import ActionAdapter from "./ActionAdapter";

export default class ActionNetwork extends ActionAdapter {

    readonly traffics: Set<Traffic> = new Set();

    hasFactoryInCity(city: City) {
        return (city.industrySlots.some(it => it.factory?.belongingSlot.owner === this.player));
    }

    hasConnectedTraffic(t1: Traffic, t2: Traffic) {
        return (t1.head === t2.head || t1.head === t2.tail || t1.tail === t2.head || t1.tail === t2.tail);
    }

    canUseCard(card: Card): boolean {
        return true;
    }

    getMaxTrafficAmount() {
        return this.player.game.era;
    }

    getHint(): string {
        return `请选择至少1条至多${this.getMaxTrafficAmount()}条还未建造的运输链路`;
    }

    canOperateTraffic(traffic: Traffic): boolean {
        if (this.hasFactoryInCity(traffic.head) || this.hasFactoryInCity(traffic.tail)) return true;
        if (Array.from(this.traffics.values()).some(t => this.hasConnectedTraffic(traffic, t))) return true;
        // TODO
        return true;
    }

    operateTraffic(traffic: Traffic): boolean {
        if (this.traffics.has(traffic)) {
            this.traffics.delete(traffic);
        } else {
            this.traffics.add(traffic);
        }
        return true;
    }

    hasSelectedTraffic(traffic: Traffic): boolean {
        return this.traffics.has(traffic);
    }

    canAct(): boolean {
        return (!!this.card && this.canPay());
    }

    canPay(): boolean {
        if (this.traffics.size < 1 || this.traffics.size > this.getMaxTrafficAmount()) return false;
        const traffic = Array.from(this.traffics.values())[0];
        const cost = traffic.type.getCost(this.traffics.size);
        // TODO
        return false;
    }

}
