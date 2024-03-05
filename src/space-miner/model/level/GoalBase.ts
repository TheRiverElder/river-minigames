import Text from "../../../libs/i18n/Text";
import Goal from "./Goal";

export default abstract class GoalBase implements Goal {

    abstract getName(): Text;

    abstract getDescription(): Text;

    abstract getProgressText(): Text;

    abstract getGoalText(): Text;

    abstract getProgress(): number;

    setup(): void { }

    destory(): void { }

}