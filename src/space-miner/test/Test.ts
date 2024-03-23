import Game from "../model/global/Game";
import MinerItem from "../model/item/MinerItem";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import OrbMiningLicenceItem from "../model/item/OrbMiningLisenceItem";
import ResourceItem from "../model/item/ResourceItem";
import MinerPartItem from "../model/item/MinerPartItem";
import SimpleItem from "../model/item/SimpleItem";
import FacilityItem from "../model/item/FacilityItem";
import { prepareTextures } from "./TestTextures";
import DrillWellFacility from "../model/facility/DrillWellFacility";
import ManualMineFacility from "../model/facility/ManualMineFacility";
import PrimaryColonyFacility from "../model/facility/PrimaryColonyFacility";
import ResidentialComplexFacility from "../model/facility/ResidentialComplexFacility";
import ResonatingPowerPlant from "../model/facility/ResonatingPowerPlant";
import SolarPowerPlantFacility from "../model/facility/SolarPowerPlantFacility";
import TranditionalMineFacility from "../model/facility/TranditionalMineFacility";
import BonusPackItem from "../model/item/BonusPackItem";
import createLevel from "./TestLevel";

export function initializeTestGame() {
    const game = new Game();

    game.facilityPersistor.registry.addAll([
        DrillWellFacility.TYPE,
        ManualMineFacility.TYPE,
        PrimaryColonyFacility.TYPE,
        ResidentialComplexFacility.TYPE,
        ResonatingPowerPlant.TYPE,
        SolarPowerPlantFacility.TYPE,
        TranditionalMineFacility.TYPE,
    ]);
    game.itemPersistor.registry.addAll([
        OrbMiningLicenceItem.TYPE,
        BonusPackItem.TYPE,
        FacilityItem.TYPE,
        MinerItem.TYPE,
        MinerPartItem.TYPE,
        ResourceItem.TYPE,
        SimpleItem.TYPE,
    ]);

    game.world.resourceTypes.addAll(Object.values(ResourceTypes));

    const level = createLevel(game);
    game.setLevel(level);

    prepareTextures();

    return game;
}
