import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPartType from "./MinerPartType";

export default abstract class MinerPart {
    
    abstract get type(): MinerPartType;

    get name(): Text {
        return new I18nText("miner_part_type." + this.type.name);
    }

    tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) { }

}