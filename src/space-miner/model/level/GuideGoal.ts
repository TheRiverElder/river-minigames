import Text from "../../../libs/i18n/Text";
import GoalBase from "./GoalBase";

export default class GuideGoal extends GoalBase {
    getName(): Text {
        throw new Error("Method not implemented.");
    }
    getDescription(): Text {
        throw new Error("Method not implemented.");
    }
    getProgressText(): Text {
        throw new Error("Method not implemented.");
    }
    getGoalText(): Text {
        throw new Error("Method not implemented.");
    }
    getProgress(): number {
        throw new Error("Method not implemented.");
    }

}