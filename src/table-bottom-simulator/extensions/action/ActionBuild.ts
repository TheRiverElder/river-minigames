import { ReactNode } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import CardBehavior from "../../builtin/behavior/CardBehavior";
import BirminghamBaseBehavior from "../behaviors/BirminghamBaseBehavior";
import FactoryBehavior from "../behaviors/FactoryBehavior";
import IndustrySlotBehavior from "../behaviors/IndustrySlotBehavior";
import Action from "./Action";

export default class ActionBuild extends Action {

    industrySlot: Nullable<IndustrySlotBehavior> = null;
    factory: Nullable<FactoryBehavior> = null;

    // isUsingCityCard() {
    //     if (!this.card) return false;
    //     return (this.card.industry.name === "<empty>" && this.card.city.name !== "<empty>");
    // }

    // isUsingIndustryCard() {
    //     if (!this.card) return false;
    //     return (this.card.city.name === "<empty>" && this.card.industry.name !== "<empty>");
    // }

    canUseCard(card: CardBehavior): boolean {
        return true;
    }

    getHint(): string {
        return "请选择一个工厂与一个产业槽";
    }

    canOperateIndustrySlot(industrySlot: IndustrySlotBehavior): boolean {
        // if (industrySlot.factory) return false;
        // if (this.isUsingIndustryCard()) return industrySlot.industries.has(this.card.industry);
        // if (this.isUsingCityCard()) return industrySlot.city === this.card.industry;
        return false;
    }

    operateIndustrySlot(industrySlot: IndustrySlotBehavior): boolean {
        if (this.industrySlot === industrySlot) {
            this.industrySlot = null;
        } else {
            this.industrySlot = industrySlot;
        }
        return true;
    }

    // hasSelectedIndustrySlot(industrySlot: IndustrySlot): boolean {
    //     return this.industrySlot === industrySlot;
    // }

    // canOperateFactory(factory: Factory): boolean {
    //     return true;
    // }

    // operateFactory(factory: Factory): boolean {
    //     if (this.factory === factory) {
    //         this.factory = null;
    //     } else {
    //         this.factory = factory;
    //     }
    //     return true;
    // }

    // hasSelectedFactory(factory: Factory): boolean {
    //     return this.factory === factory;
    // }

    // canAct(): boolean {
    //     return (!!this.card && !!this.industrySlot && !!this.factory);
    // }

    render(): ReactNode {
        throw new Error("Method not implemented.");
    }

    canClick(behavior: BirminghamBaseBehavior): boolean {
        if (!(behavior instanceof IndustrySlotBehavior)) return false;

        // behavior.
        return false;
    }

}