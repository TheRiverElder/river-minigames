import Game from "../model/global/Game";
// import MinerItem from "../model/item/MinerItem.ts.disabled";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import OrbMiningLicenceItem from "../model/item/OrbMiningLisenceItem";
import ResourceItem from "../model/item/ResourceItem";
// import MinerPartItem from "../model/item/MinerPartItem.ts.disabled";
// import SimpleItem from "../model/item/SimpleItem.ts.disabled";
import FacilityItem from "../model/item/FacilityItem";
import { prepareTextures } from "./TestTextures";
// import DrillWellFacility from "../model/facility/DrillWellFacility.tsx.disabled";
import ManualMineFacility from "../model/facility/ManualMineFacility.tsx";
import PrimaryColonyFacility from "../model/facility/PrimaryColonyFacility";
// import ResidentialComplexFacility from "../model/facility/ResidentialComplexFacility";
// import ResonatingPowerPlant from "../model/facility/ResonatingPowerPlant";
// import SolarPowerPlantFacility from "../model/facility/SolarPowerPlantFacility";
// import TranditionalMineFacility from "../model/facility/TranditionalMineFacility.tsx.disabled";
import BonusPackItem from "../model/item/BonusPackItem";
import { createLevel_1 } from "./TestLevel.ts";

export function initializeTestGame() {
    const game = new Game();

    game.facilityPersistor.registry.addAll([
        // DrillWellFacility.TYPE,
        ManualMineFacility.TYPE,
        PrimaryColonyFacility.TYPE,
        // ResidentialComplexFacility.TYPE,
        // ResonatingPowerPlant.TYPE,
        // SolarPowerPlantFacility.TYPE,
        // TranditionalMineFacility.TYPE,
    ]);
    game.itemPersistor.registry.addAll([
        OrbMiningLicenceItem.TYPE,
        BonusPackItem.TYPE,
        FacilityItem.TYPE,
        // MinerItem.TYPE,
        // MinerPartItem.TYPE,
        ResourceItem.TYPE,
        // SimpleItem.TYPE,
    ]);

    game.world.resourceTypes.addAll(Object.values(ResourceTypes));

    const level = createLevel_1(game);
    game.setLevel(level);

    prepareTextures();

    return game;
}
