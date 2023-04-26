import { Emptyable, Nullable } from "../../libs/lang/Optional";
import Card from "../Card";
import City from "../City";
import FactorySlot from "../FactorySLot";
import Game from "../Game";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import Traffic from "../traffic/Traffic";

export default interface ActionType {
    get name(): string;

    canAct(player: Player, card: Card, args: ActionParams, game: Game): boolean;

    act(player: Player, card: Card, args: ActionParams, game: Game): void;
}

export interface ActionParams {
    city?: City;
    traffics?: Array<Traffic>;
    doneIndustrySlots?: Array<IndustrySlot>;
    factorySlots?: Array<FactorySlot>;
    cards?: Array<Card>;
}