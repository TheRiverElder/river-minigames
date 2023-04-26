import { removeFromArray } from "../../libs/lang/Collections";
import Card from "../Card";
import { CARD_TYPE_CITY, CARD_TYPE_INDUSTRY } from "../CardType";
import { CITY_EMPTY, CITY_WILD } from "../City";
import Game from "../Game";
import { INDUSTRY_ANY, INDUSTRY_EMPTY } from "../Industry";
import Player from "../Player";
import Action, { ActionParams } from "./ActionType";

export default class ActionTypeScout implements Action {

    get name(): string {
        return "侦察";
    }

    canAct(player: Player, card: Card, args: ActionParams, game: Game): boolean {
        const cards = args.cards;
        if (!cards || cards.length !== 2) return false;
        return true;
    }

    act(player: Player, card: Card, args: ActionParams, game: Game): void {
        if (!this.canAct(player, card, args, game)) throw new Error("不能行动！");
        const cards = args.cards;
        if (!cards || cards.length !== 2) return;
        cards.forEach(card => removeFromArray(player.cards, card));
        player.cards.push(
            new Card(CARD_TYPE_INDUSTRY, INDUSTRY_ANY, CITY_EMPTY),
            new Card(CARD_TYPE_CITY, INDUSTRY_EMPTY, CITY_WILD),
        );
    }

}