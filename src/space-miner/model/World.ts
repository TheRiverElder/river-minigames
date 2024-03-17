import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import Game from "../Game";
import ResourceType from "./misc/ResourceType";
import Orb, { OrbModel } from "./orb/Orb";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import { Displayable, mapModel } from "../../libs/io/Displayable";

export default class World implements Displayable<WorldModel> {

    readonly game: Game;

    readonly orbUidGenerator = new IncrementNumberGenerator();
    genOrbUid(): int {
        return this.orbUidGenerator.generate();
    }
    
    constructor(game: Game) {
        this.game = game;
    }

    getDisplayedModel(): WorldModel {
        return {
            tickCounter: this.tickCounter,
            orbs: this.orbs.values().map(mapModel),
        };
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

export type WorldModel = Readonly<{
    tickCounter: int;
    orbs: Array<OrbModel>;
}>;