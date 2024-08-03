import Game from "../model/global/Game";
import GuideLevel from "../model/level/GuideLevel";
import Level from "../model/level/Level";
import LevelCheckedGoal from "../model/level/LevelCheckedGoal";
import MoneyAmountGoal from "../model/level/MoneyAmountGoal";
import ResourceAmountGoal from "../model/level/ResourceAmountGoal";
import SpecificResourceAmountGoal from "../model/level/SpecificResourceGoal";
import TechnologyUnlockedGoal from "../model/level/TechnologyUnlockedGoal";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import { TechnologyNames } from "../model/misc/TechnologyNames";

export function createLevel_1(game: Game): Level {
    return new GuideLevel(game, "guide_01", [
        new LevelCheckedGoal(),
        new LevelCheckedGoal(),
        new ResourceAmountGoal(game, 50, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON_ORE, 10, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON, 5, it => it.name === "Terra"),
        new MoneyAmountGoal(game, 50),
    ]);
}

export function createLevel_2(game: Game): Level {
    return new GuideLevel(game, "guide_02", [
        new TechnologyUnlockedGoal(game, TechnologyNames.URANIUM_PROCESSINGS, 1),
    ]);
}