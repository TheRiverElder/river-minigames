import GenericTrader from "../model/contract/GenericTrader";
import Game from "../model/global/Game";

export default function initializeTestTraders(game: Game) {
    game.traders.add(game.profile);
    game.traders.add(new GenericTrader(1, "Terra商业联盟", game));
}