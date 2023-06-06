import Game from "./Game";
import { repeatRun } from "../libs/lang/Extensions";
import MinerPartItem from "./model/item/MinerPartItem";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";
import { randOne } from "../libs/math/Mathmatics";
import { RESOURCE_TYPES, RESOURCE_TYPE_CORE_LAVA } from "./model/ResourceTypes";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(RESOURCE_TYPES);

    game.profile.account = 10000000;

    repeatRun(() => game.discoverAndUpdateShop(), 3);
    game.shop.items.push(
        new MinerPartItem(new FramePart(100, 100000, 100000)),
        new MinerPartItem(new MainControlPart(0.012)),
        new MinerPartItem(new CargoPart(10000)),
        new MinerPartItem(new CollectorPart(RESOURCE_TYPE_CORE_LAVA, 2)),
    );

    return game;
}