import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import { InOrbLocation } from "../orb/Orb";
import Profile from "../global/Profile";
import Miner from "./Miner";
import MinerPartType from "./MinerPartType";

export default abstract class MinerPart<TSelf = any> {
    
    abstract get type(): MinerPartType;

    get name(): Text {
        return new I18nText(`miner_part.${this.type.name}.name`);
    }

    get description(): Text {
        return new I18nText(`miner_part.${this.type.name}.description`, this.descriptionArgs);
    }

    protected get descriptionArgs(): any { return {}; }

    setup(miner: Miner, location: InOrbLocation) { }
    
    dispose(miner: Miner, location: InOrbLocation) { }

    preTick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game) { }

    tick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game) { }

    postTick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game) { }

    abstract copy(): TSelf;
    
    abstract equals(another: MinerPart): boolean;

}