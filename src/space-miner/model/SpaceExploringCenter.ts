import { removeFromArray } from "../../libs/lang/Collections";
import Game from "../Game";
import { randomOrb } from "../Test";
import Orb from "./Orb";
import Profile from "./Profile";

export default class SpaceExploringCenter {

    readonly game: Game;

    readonly unclaimedOrbs = new Array<Orb>();

    constructor(game: Game) {
        this.game = game;
    }

    tick() {
        if (this.game.tickCounter % 1000 === 0) {
            this.unclaimedOrbs.push(this.createNewOrb());
            if (this.unclaimedOrbs.length > 5) {
                this.unclaimedOrbs.splice(0, this.unclaimedOrbs.length - 5);
            }
        }
    }

    private createNewOrb() {
        return randomOrb(this.game);
    }

    claim(profile: Profile, orb: Orb) {
        if (orb.owner) return;
        orb.owner = profile;
        removeFromArray(this.unclaimedOrbs, orb);
        profile.orbs.add(orb);
    }
}