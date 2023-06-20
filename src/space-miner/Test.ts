import Game from "./Game";
import { repeatRun } from "../libs/lang/Extensions";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";
import { RESOURCE_TYPES, RESOURCE_TYPE_CORE_LAVA } from "./model/ResourceTypes";
import Technology from "./model/technology/Technology";
import { int } from "../libs/CommonTypes";
import { peekNullable } from "../libs/lang/Collections";
import MinerRecipe from "./model/assemble/MinerRecipe";
import MinerItem from "./model/item/MinerItem";
import Miner from "./model/miner/Miner";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(RESOURCE_TYPES);

    game.profile.account = 10000000;

    repeatRun(() => game.discoverAndUpdateShop(), 3);
    
    game.shop.refreshGoods(game);

    technologies.forEach(tech => game.technologies.add(tech));
    game.recipes.add(new MinerRecipe());

    game.profile.warehouse.add(new MinerItem(new Miner({
        frame: new FramePart(100, 100000, 100000),
        mainControl: new MainControlPart(0.12),
        cargo: new CargoPart(10000),
        collector: new CollectorPart(RESOURCE_TYPE_CORE_LAVA, 2),
        additions: [],
    })));

    return game;
}

const technologies = [
    ...createSeriesTechnology("high_temeperature_storage", 3),
    ...createSeriesTechnology("cooling", 3),
    ...createSeriesTechnology("uranium_processing", 2),
    ...createSeriesTechnology("space_folding", 2),
    new Technology("shunting_by_density"),
    new Technology("reduction"),
];

function createSeriesTechnology(name: string, maxLevel: int): Array<Technology> {
    const series: Array<Technology> = [];
    for (let level = 1; level <= maxLevel; level++) {
        const prior = peekNullable(series);
        const priors = prior ? [prior] : [];
        const technology = new Technology(name, level, priors);
        series.push(technology);
    }
    return series;
}