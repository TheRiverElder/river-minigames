import Game from "./Game";
import { repeatRun } from "../libs/lang/Extensions";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";
import Technology from "./model/technology/Technology";
import { int } from "../libs/CommonTypes";
import { peekNullable } from "../libs/lang/Collections";
import MinerRecipe from "./model/assemble/MinerRecipe";
import MinerItem from "./model/item/MinerItem";
import Miner from "./model/miner/Miner";
import { ResourceTypes } from "./model/ResourceTypes";
import OrbMiningLicenceItem from "./model/item/OrbMiningLisenceItem";
import ResourceItem from "./model/item/ResourceItem";
import MinerPartItem from "./model/item/MinerPartItem";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(Object.values(ResourceTypes));
    game.itemTypes.addAll([
        OrbMiningLicenceItem.TYPE,
        MinerItem.TYPE,
        MinerPartItem.TYPE,
        ResourceItem.TYPE,
    ]);

    game.profile.account = 10000000;

    repeatRun(() => game.discoverAndUpdateShop(), 3);
    
    game.shop.refreshGoods(game);

    createTechnologies().forEach(tech => game.technologies.add(tech));
    game.recipes.add(new MinerRecipe());

    game.profile.warehouse.add(new MinerItem(new Miner({
        frame: new FramePart(100, 100000, 100000),
        mainControl: new MainControlPart(0.12),
        cargo: new CargoPart(10000),
        collector: new CollectorPart(ResourceTypes.CORE_LAVA, 2),
        additions: [],
    })));

    return game;
}

function createTechnologies() {
    const highTemeperatureStorageSeries = createSeriesTechnology("high_temeperature_storage", 3);
    const coolingSeries = createSeriesTechnology("cooling", 3);
    const uraniumProcessingSeries = createSeriesTechnology("uranium_processing", 2);
    const shuntingByDensity = new Technology("shunting_by_density");
    const nuclearFuelRod1 = new Technology("nuclear_fuel_rod", 1, [shuntingByDensity, uraniumProcessingSeries[0]]);
    const nuclearFuelRod2 = new Technology("nuclear_fuel_rod", 2, [nuclearFuelRod1, uraniumProcessingSeries[1]]);
    const reduction = new Technology("reduction");
    const spaceFoldingSeries = createSeriesTechnology("space_folding", 2);

    return [
        ...highTemeperatureStorageSeries,
        ...coolingSeries,
        ...uraniumProcessingSeries,
        nuclearFuelRod1, nuclearFuelRod2,
        ...spaceFoldingSeries,
        shuntingByDensity,
        reduction,
    ];
}

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