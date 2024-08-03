import { int } from "../../libs/CommonTypes";
import { peekNullable } from "../../libs/lang/Collections";
import { TechnologyNames } from "../model/misc/TechnologyNames";
import Technology from "../model/technology/Technology";

export function createTechnologies() {
    const highTemeperatureStorageSeries = createSeriesTechnology(TechnologyNames.HIGH_TEMEPERATURE_STORAGE, 3);
    const coolingSeries = createSeriesTechnology(TechnologyNames.COOLING, 3);
    const uraniumProcessingSeries = createSeriesTechnology(TechnologyNames.URANIUM_PROCESSINGS, 2);
    const shuntingByDensity = new Technology(TechnologyNames.SHUNTING_BY_DENSITY);
    const nuclearFuelRod1 = new Technology(TechnologyNames.NUCLEAR_FUELROD, 1, [shuntingByDensity, uraniumProcessingSeries[0]]);
    const nuclearFuelRod2 = new Technology(TechnologyNames.NUCLEAR_FUELROD, 2, [nuclearFuelRod1, uraniumProcessingSeries[1]]);
    const reduction = new Technology(TechnologyNames.REDUCTION);
    const spaceFoldingSeries = createSeriesTechnology(TechnologyNames.SPACE_FOLDING, 2);

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
