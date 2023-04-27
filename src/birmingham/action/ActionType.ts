import { Productor } from "../../libs/CommonTypes";
import Card from "../Card";
import City from "../City";
import FactorySlot from "../FactorySLot";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import Traffic from "../traffic/Traffic";
import Action from "./Action";

export default class ActionType {
    readonly name: string;
    readonly creator: Productor<Player, Action>;

    constructor(name: string, creator: Productor<Player, Action>) {
        this.name = name;
        this.creator = creator;
    }

    create(player: Player) {
        return this.creator(player);
    }
}

export interface ActionParams {
    city?: City;
    traffics?: Array<Traffic>;
    doneIndustrySlots?: Array<IndustrySlot>;
    factorySlots?: Array<FactorySlot>;
    cards?: Array<Card>;
}