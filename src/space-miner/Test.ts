import { randSome } from "../libs/math/Mathmatics";
import Game from "./Game";
import { RESOURCE_TYPES } from "./ResourceTypes";
import Miner from "./model/Miner";
import { repeatRun } from "../libs/lang/Extensions";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(RESOURCE_TYPES);

    repeatRun(() => game.discoverAndUpdateShop(), 5);

    game.profile.account = 10000000;

    return game;
}

export function randomMiner(game: Game) {
    const miner = new Miner();
    miner.energy = miner.maxEnergy = 1000;
    randSome(game.world.mineTypes.values(), 2).forEach(type => miner.mineables.add(type));
    return miner;
}