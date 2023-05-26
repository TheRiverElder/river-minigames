import { Nullable } from "../../libs/lang/Optional";
import Card, { CARD_EMPTY } from "../Card";
import Factory from "../Factory";
import IndustrySlot from "../IndustrySlot";
import ActionAdapter from "./ActionAdapter";

export default class ActionBuild extends ActionAdapter {

    industrySlot: Nullable<IndustrySlot> = null;
    factory: Nullable<Factory> = null;

    isUsingCityCard() {
        if (!this.card) return false;
        return (this.card.industry.name === "<empty>" && this.card.city.name !== "<empty>");
    }

    isUsingIndustryCard() {
        if (!this.card) return false;
        return (this.card.city.name === "<empty>" && this.card.industry.name !== "<empty>");
    }

    canUseCard(card: Card): boolean {
        return true;
    }

    getHint(): string {
        return "请选择一个工厂与一个产业槽";
    }

    canOperateIndustrySlot(industrySlot: IndustrySlot): boolean {
        if (industrySlot.factory) return false;
        if (this.isUsingIndustryCard()) return industrySlot.industries.has(this.card.industry);
        if (this.isUsingCityCard()) return industrySlot.city === this.card.industry;
        return false;
    }

    operateIndustrySlot(industrySlot: IndustrySlot): boolean {
        if (this.industrySlot === industrySlot) {
            this.industrySlot = null;
        } else {
            this.industrySlot = industrySlot;
        }
        return true;
    }

    hasSelectedIndustrySlot(industrySlot: IndustrySlot): boolean {
        return this.industrySlot === industrySlot;
    }

    canOperateFactory(factory: Factory): boolean {
        return true;
    }

    operateFactory(factory: Factory): boolean {
        if (this.factory === factory) {
            this.factory = null;
        } else {
            this.factory = factory;
        }
        return true;
    }

    hasSelectedFactory(factory: Factory): boolean {
        return this.factory === factory;
    }

    canAct(): boolean {
        return (!!this.card && !!this.industrySlot && !!this.factory);
    }

}