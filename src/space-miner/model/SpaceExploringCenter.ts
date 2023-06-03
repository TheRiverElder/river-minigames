import Game from "../Game";
import Orb from "./Orb";
import Profile from "./Profile";
import World from "./World";
import OrbGenerator from "./generation/OrbGenerator";

export default class SpaceExploringCenter {

    readonly orbGenerator: OrbGenerator;

    constructor(orbGenerator: OrbGenerator) {
        this.orbGenerator = orbGenerator;
    }

    getUnclaimedOrbs(world: World): Array<Orb> {
        return world.orbs.values().filter(orb => !orb.owner);
    }

    tick(game: Game) {
        if (game.world.tickCounter % 1000 === 0) {
            if (this.getUnclaimedOrbs(game.world).length < 5) {
                this.discover(game.world);
            }
        }
    }

    discover(world: World): Orb {
        return this.orbGenerator.generate(world);
    }

    claim(profile: Profile, orb: Orb) {
        if (orb.owner) return;
        orb.owner = profile;
        profile.ownedOrbs.add(orb);
    }
}