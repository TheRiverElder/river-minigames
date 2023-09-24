import Game from "../Game";
import DrillWellFacility from "../model/facility/DrillWellFacility";
import ResidentialComplexFacility from "../model/facility/ResidentialComplexFacility";
import SolarPowerPlantFacility from "../model/facility/SolarPowerPlantFacility";
import TranditionalMineFacility from "../model/facility/TranditionalMineFacility";
import FacilityItem from "../model/item/FacilityItem";
import { Tags } from "../model/item/Tags";
import CargoPart from "../model/miner/CargoPart";
import CollectorPart from "../model/miner/CollectorPart";
import FramePart from "../model/miner/FramePart";
import MainControlPart from "../model/miner/MainControlPart";
import Miner from "../model/miner/Miner";

export function createItems(game: Game) {
    return [
        new FacilityItem(new SolarPowerPlantFacility(10e4)),
        new FacilityItem(new ResidentialComplexFacility(1e8, 0.005)),
        new FacilityItem(new DrillWellFacility(new Miner({
            frame: new FramePart(100, 100000, 100000),
            mainControl: new MainControlPart(0.12),
            cargo: new CargoPart(10000),
            collector: new CollectorPart(2, 3000, [Tags.SOLID]),
            additions: [],
        }))),
        new FacilityItem(new TranditionalMineFacility(1000, [Tags.SOLID, Tags.STRUCTURE, Tags.FLUID])),
    ];
}