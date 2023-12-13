import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import Game from "../Game";
import ResourceType from "./misc/ResourceType";
import Orb from "./orb/Orb";
import ObservableRegistry from "../../libs/management/ObservableRegistry";

export default class World {

    readonly game: Game;

    readonly orbUidGenerator = new IncrementNumberGenerator();
    genOrbUid(): int {
        return this.orbUidGenerator.generate();
    }
    
    constructor(game: Game) {
        this.game = game;
    }

    readonly orbs = new ObservableRegistry<int, Orb>(orb => orb.uid);
    
    readonly resourceTypes = new Registry<string, ResourceType>(type => type.name); 
    
    tickCounter: int = 0;

    preTick(game: Game) {
        this.orbs.values().forEach(orb => orb.preTick(game));
    }

    tick(game: Game) {
        this.orbs.values().forEach(orb => orb.tick(game));
    }

    postTick(game: Game) {
        this.orbs.values().forEach(orb => orb.postTick(game));
        this.tickCounter++;
    }
    
}