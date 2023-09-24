import { int } from "../../libs/CommonTypes";
import { peekNullable } from "../../libs/lang/Collections";
import Technology from "../model/technology/Technology";

export function createTechnologies() {
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
