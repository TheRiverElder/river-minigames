import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import GoalBase from "./GoalBase";

export default class LevelCheckedGoal extends GoalBase {

    checked = false;

    getName(): Text { return new I18nText(`goal.level_checked.name`); }
    getDescription(): Text { return new I18nText(`goal.level_checked.description`); }

    getProgressText(): Text { return new I18nText("goal.level_checked.level_not_checked"); }
    getGoalText(): Text { return new I18nText("goal.level_checked.level_checked"); }

    getProgress(): number {
        return this.checked ? 1 : 0;
    }
    
}