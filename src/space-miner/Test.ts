import Game from "./Game";
import { repeatRun } from "../libs/lang/Extensions";
import MinerPartItem from "./model/item/MinerPartItem";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";
import { RESOURCE_TYPES, RESOURCE_TYPE_CORE_LAVA } from "./model/ResourceTypes";
import Technology from "./model/technology/Technology";
import { int } from "../libs/CommonTypes";
import { createArray, peek, peekNullable } from "../libs/lang/Collections";
import { Nullable } from "../libs/lang/Optional";
import MinerRecipe from "./model/assemble/MinerRecipe";

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

    technologies.forEach(tech => game.technologies.add(tech));
    game.recipes.add(new MinerRecipe());

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