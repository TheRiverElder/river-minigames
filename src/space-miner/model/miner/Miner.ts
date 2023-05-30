import { double } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Orb from "../Orb";
import Game from "../../Game";
import MinerPart from "./MinerPart";
import CargoPart from "./CargoPart";
import CollectorPart from "./CollectorPart";
import Profile from "../Profile";
import FramePart from "./FramePart";

export interface MinerAssemble {
    frame: FramePart;
    mainControl: MinerPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;
}

export interface MinerLocation {
    orb: Orb;
    depth: double;
    // surfacePosition: double; // 在地表的位置
}

export default class Miner {

    frame: FramePart;
    mainControl: MinerPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;

    location: Nullable<MinerLocation> = null;

    constructor(assemble: MinerAssemble) {
        this.frame = assemble.frame;
        this.mainControl = assemble.mainControl;
        this.cargo = assemble.cargo;
        this.collector = assemble.collector;
        this.additions = assemble.additions.slice();
    }

    tick(game: Game) {
        const energyCost = 10;
        if (this.location && this.frame.energy >= energyCost) {
            this.frame.mutateEnergy(-energyCost);
            this.work(this.location, game.profile, game);
        }
    }

    work(location: MinerLocation, profile: Profile, game: Game) {
        [
            this.frame, 
            this.mainControl, 
            this.cargo, 
            this.collector, 
            ...this.additions,
        ].forEach(part => part.tick(this, location, profile, game));
    }
}