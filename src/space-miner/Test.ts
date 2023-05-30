import Game from "./Game";
import { RESOURCE_TYPES, RESOURCE_TYPE_WOOD } from "./ResourceTypes";
import { repeatRun } from "../libs/lang/Extensions";
import MinerPartItem from "./model/item/MinerPartItem";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(RESOURCE_TYPES);

    game.profile.account = 10000000;

    repeatRun(() => game.discoverAndUpdateShop(), 3);
    game.shop.items.push(
        new MinerPartItem(new FramePart(100, 100000, 100000)),
        new MinerPartItem(new MainControlPart()),
        new MinerPartItem(new CargoPart(10000)),
        new MinerPartItem(new CollectorPart(RESOURCE_TYPE_WOOD, 2)),
    );

    return game;
}