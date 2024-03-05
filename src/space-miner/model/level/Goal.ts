import { double } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";

export default interface Goal {

    getName(): Text; // 例：收集金钱
    getDescription(): Text; // 例：存款达到指定数额以达成此目标
    getProgressText(): Text; // 例：1234 Cd.
    getGoalText(): Text; // 例：10000 Cd.
    getProgress(): double; // 例：0.59

    setup(): void;
    destory(): void;
}