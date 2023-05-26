import { Pair, double } from "../libs/CommonTypes";
import { rand, randInt, randSome } from "../libs/math/Mathmatics";
import Vector2 from "../libs/math/Vector2";
import Game from "./Game";
import { MINE_TYPES } from "./MineTypes";
import Miner from "./model/Miner";
import MineType from "./model/MineType";
import Orb from "./model/Orb";

export function initializeTestGame() {
    const game = new Game();

    MINE_TYPES.forEach(type => game.mineTypes.add(type));

    for (let i = 0; i < 5; i++) {
        const orb = randomOrb(game);
        const miner = randomMiner(game);
        orb.miners.add(miner);
    };
    return game;
}

function randomOrb(game: Game) {
    return game.createAndAddOrb(([game, uid]) => new Orb(
        game,
        uid, 
        "aaa", {
            radius: rand(40, 60),
            color: 0x66ccff,
            position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
            forward: rand(0, 2 * Math.PI),
            rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, 
        randomMines(game),
    ));
}

function randomMines(game: Game): Array<Pair<MineType, double>> {
    const mineTypes = game.mineTypes.values();
    const typeAmount = randInt(2, mineTypes.length);
    const mineables = randSome(mineTypes, typeAmount);
    return mineables.map(type => [type, rand(5000, 60000)]);
}

function randomMiner(game: Game) {
    const miner = new Miner();
    miner.energy = miner.maxEnergy = 1000;
    randSome(game.mineTypes.values(), 2).forEach(type => miner.mineables.add(type));
    return miner;
}