import { createArray } from "../../libs/lang/Collections";
import { repeatRun } from "../../libs/lang/Extensions";
import { randOne } from "../../libs/math/Mathmatics";
import Game from "../Game";
import DrillWellFacility from "../model/facility/DrillWellFacility";
import ManualMineFacility from "../model/facility/ManualMineFacility";
import PrimaryColonyFacility from "../model/facility/PrimaryColonyFacility";
import ResidentialComplexFacility from "../model/facility/ResidentialComplexFacility";
import ResonatingPowerPlant from "../model/facility/ResonatingPowerPlant";
import SolarPowerPlantFacility from "../model/facility/SolarPowerPlantFacility";
import TranditionalMineFacility from "../model/facility/TranditionalMineFacility";
import FacilityItem from "../model/item/FacilityItem";
import Item from "../model/item/Item";
import ResourceItem from "../model/item/ResourceItem";
import { Tags } from "../model/item/Tags";
import CargoPart from "../model/miner/CargoPart";
import CollectorPart from "../model/miner/CollectorPart";
import FramePart from "../model/miner/FramePart";
import MainControlPart from "../model/miner/MainControlPart";
import Miner from "../model/miner/Miner";
import { NATURAL_RESOURCE_TYPES, ResourceTypes } from "../model/misc/ResourceTypes";

export function createItems(game: Game): Array<Item> {
    return [
        new FacilityItem(PrimaryColonyFacility.TYPE.create(game)),
        new FacilityItem(ManualMineFacility.TYPE.create(game)),
        // new FacilityItem(new ResonatingPowerPlant(25e4, 20e4, false, 1.0)),
        // new ResourceItem(ResourceTypes.RESONATING_CRYSTAL, 5e4),
        // new FacilityItem(new SolarPowerPlantFacility(10e4, 1.5, 1.0)),
        // new FacilityItem(new ResidentialComplexFacility(5e3, 0.2)),
        // new FacilityItem(new DrillWellFacility(new Miner({
        //     frame: new FramePart(100, 100000, 100000),
        //     mainControl: new MainControlPart(1.2),
        //     cargo: new CargoPart(20000),
        //     collector: new CollectorPart(2, 3000, [Tags.SOLID]),
        //     additions: [],
        // }), 0.0)),
        // new FacilityItem(new TranditionalMineFacility(2e3, [Tags.SOLID, Tags.STRUCTURE, Tags.FLUID], 1.0)),
        ...createArray(100, (index) => (new ResourceItem(game, randOne(NATURAL_RESOURCE_TYPES), index + 1))),
    ];
}