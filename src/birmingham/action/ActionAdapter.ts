import Card from "../Card";
import Factory from "../Factory";
import IndustrySlot from "../IndustrySlot";
import Traffic from "../traffic/Traffic";
import Action from "./Action";

export default class ActionAdapter extends Action {

    hasSelectedCard(card: Card): boolean { return false; }
    hasSelectedTraffic(traffic: Traffic): boolean { return false; }
    hasSelectedIndustrySlot(industrySlot: IndustrySlot): boolean { return false; }
    hasSelectedFactory(factory: Factory): boolean { return false; }

    canOperateCard(card: Card): boolean { return false; }
    canOperateTraffic(traffic: Traffic): boolean { return false; }
    canOperateIndustrySlot(industrySlot: IndustrySlot): boolean { return false; }
    canOperateFactory(factory: Factory): boolean { return false; }

    operateCard(card: Card): boolean { return false; }
    operateTraffic(traffic: Traffic): boolean { return false; }
    operateIndustrySlot(industrySlot: IndustrySlot): boolean { return false; }
    operateFactory(factory: Factory): boolean { return false; }

    canUseCard(card: Card): boolean { return false; }
    getHint(): string { return ""; }
    
    canAct(): boolean { return false; }
}
