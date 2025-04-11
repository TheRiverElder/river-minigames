import { createArray } from "../../libs/lang/Collections";
import { randOne } from "../../libs/math/Mathmatics";
import Game from "../model/global/Game";
import PrimaryColonyFacility from "../model/facility/PrimaryColonyFacility";
import FacilityItem from "../model/item/FacilityItem";
import Item from "../model/item/Item";
import ResourceItem from "../model/item/ResourceItem";
import { NATURAL_RESOURCE_TYPES } from "../model/misc/ResourceTypes";
import ManualMineFacility from "../model/facility/ManualMineFacility";

export function createItems(game: Game): Array<Item> {
    return [
        // new FacilityItem(game, PrimaryColonyFacility.TYPE),
        new FacilityItem(game, ManualMineFacility.TYPE),
        // new FacilityItem(ManualMineFacility.TYPE.create(game)),
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