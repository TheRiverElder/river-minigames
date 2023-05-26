import Card, { CARD_EMPTY } from "../Card";
import IndustrySlot from "../IndustrySlot";
import ActionAdapter from "./ActionAdapter";

export default class ActionSell extends ActionAdapter {

    readonly industrySlots: Set<IndustrySlot> = new Set();
    readonly barSlots: Set<IndustrySlot> = new Set();

    canUseCard(card: Card): boolean {
        return true;
    }

    getHint(): string {
        return "请在内场选择至少1个未卖出工厂以及对应的酒馆";
    }

    canOperateIndustrySlot(industrySlot: IndustrySlot): boolean {
        if (!industrySlot.factory) return false;
        if (industrySlot.factory.sold) return false;
        // TODO
        // industrySlot.city.canReachBar();
        return true;
    }

    operateIndustrySlot(industrySlot: IndustrySlot): boolean {
        if (this.industrySlots.has(industrySlot)) {
            this.industrySlots.delete(industrySlot);
        } else {
            this.industrySlots.add(industrySlot);
        }
        return true;
    }

    hasSelectedIndustrySlot(industrySlot: IndustrySlot): boolean {
        return this.industrySlots.has(industrySlot);
    }

    canAct(): boolean {
        return (!!this.card && this.industrySlots.size > 0 && this.barSlots.size > 0 && this.industrySlots.size === this.barSlots.size);
    }

}