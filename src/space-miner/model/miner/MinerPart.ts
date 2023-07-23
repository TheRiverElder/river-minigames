import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPartType from "./MinerPartType";

export default abstract class MinerPart {
    
    abstract get type(): MinerPartType;

    get name(): Text {
        return new I18nText(`miner_part.${this.type.name}.name`);
    }

    get description(): Text {
        return new I18nText(`miner_part.${this.type.name}.description`, this.descriptionArgs);
    }

    protected get descriptionArgs(): any { return {}; }

    setup(miner: Miner, location: MinerLocation) { }
    
    dispose(miner: Miner, location: MinerLocation) { }

    tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) { }

}