import Game from "../model/global/Game";
import GuideLevel from "../model/level/GuideLevel";
import Level from "../model/level/Level";
import LevelCheckedGoal from "../model/level/LevelCheckedGoal";
import MoneyAmountGoal from "../model/level/MoneyAmountGoal";
import ResourceAmountGoal from "../model/level/ResourceAmountGoal";
import SpecificResourceAmountGoal from "../model/level/SpecificResourceGoal";
import { ResourceTypes } from "../model/misc/ResourceTypes";

function createLevel_1(game: Game): Level {
    return new GuideLevel(game, "guide_01", [
        new LevelCheckedGoal(),
        new LevelCheckedGoal(),
        new ResourceAmountGoal(game, 50, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON_ORE, 10, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON, 5, it => it.name === "Terra"),
        new MoneyAmountGoal(game, 50),
    ]);
}

function createLevel_2(game: Game): Level {
    return new GuideLevel(game, "guide_02", [
        
    ]);
}

export default {
    createLevel: createLevel_1,
} 