import { double } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";

export default interface Goal {
    getName(): Text;
    getDescription(): Text;
    getProgress(): double;

    setup(): void;
    destory(): void;
}