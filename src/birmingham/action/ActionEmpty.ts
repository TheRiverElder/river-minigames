import Card from "../Card";
import FactorySlot from "../FactorySlot";
import IndustrySlot from "../IndustrySlot";
import Action from "./Action";

export default class ActionEmpty extends Action {

    canUseCard(card: Card): boolean { return false; }
    canSelectIndustrySlot(industrySlot: IndustrySlot): boolean { return false; }
    canSelectFactorySlot(factorySlot: FactorySlot): boolean { return false; }
    canAct(): boolean { return false; }
    act(): void {}
}
