import Game from "../model/global/Game";
import GuideLevel from "../model/level/GuideLevel";
import Level from "../model/level/Level";
import LevelCheckedGoal from "../model/level/LevelCheckedGoal";
import MoneyAmountGoal from "../model/level/MoneyAmountGoal";
import ResourceAmountGoal from "../model/level/ResourceAmountGoal";
import SpecificResourceAmountGoal from "../model/level/SpecificResourceGoal";
import { ResourceTypes } from "../model/misc/ResourceTypes";

export default function createLevel(game: Game): Level {
    return new GuideLevel(game, [
        new LevelCheckedGoal(),
        new LevelCheckedGoal(),
        new ResourceAmountGoal(game, 50, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON_ORE, 10, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.IRON, 5, it => it.name === "Terra"),
        new MoneyAmountGoal(game, 2 * (game.profile.account || 100000)),
    ]);
}