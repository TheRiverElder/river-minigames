import { ReactNode } from "react";
import CardBehavior from "../../builtin/behavior/CardBehavior";
import IndustrySlotBehavior from "../behaviors/IndustrySlotBehavior";
import Action from "./Action";

export default class ActionSell extends Action {

    readonly industrySlots: Set<IndustrySlotBehavior> = new Set();
    readonly barSlots: Set<IndustrySlotBehavior> = new Set();

    canUseCard(card: CardBehavior): boolean {
        return true;
    }

    getHint(): string {
        return "请在内场选择至少1个未卖出工厂以及对应的酒馆";
    }

    canOperateIndustrySlot(industrySlot: IndustrySlotBehavior): boolean {
        // if (!industrySlot.factory) return false;
        // if (industrySlot.factory.sold) return false;
        // TODO
        // industrySlot.city.canReachBar();
        return true;
    }

    operateIndustrySlot(industrySlot: IndustrySlotBehavior): boolean {
        if (this.industrySlots.has(industrySlot)) {
            this.industrySlots.delete(industrySlot);
        } else {
            this.industrySlots.add(industrySlot);
        }
        return true;
    }

    hasSelectedIndustrySlot(industrySlot: IndustrySlotBehavior): boolean {
        return this.industrySlots.has(industrySlot);
    }

    canAct(): boolean {
        return (!!this.card && this.industrySlots.size > 0 && this.barSlots.size > 0 && this.industrySlots.size === this.barSlots.size);
    }

    render(): ReactNode {
        throw new Error("Method not implemented.");
    }

}