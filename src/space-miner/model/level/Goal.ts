import { double } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";

export default interface Goal {
    getName(): Text; // 例：收集金钱
    getDescription(): Text; // 例：收集金钱
    getProgressText(): Text; // 例：收集金钱
    getGoalText(): Text; // 例：10000 C.D.
    getProgress(): double; // 例：0.59

    setup(): void;
    destory(): void;
}