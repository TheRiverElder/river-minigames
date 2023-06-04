import Game from "../Game";
import Orb from "./Orb";
import Profile from "./Profile";
import World from "./World";
import OrbGenerator from "./generation/OrbGenerator";
import { int } from "../../libs/CommonTypes";

export default class SpaceExploringCenter {

    readonly orbGenerator: OrbGenerator;

    constructor(orbGenerator: OrbGenerator) {
        this.orbGenerator = orbGenerator;
    }

    getUnclaimedOrbs(world: World): Array<Orb> {
        return world.orbs.values().filter(orb => !orb.owner);
    }

    countUnclaimedOrbs(world: World): int {
        let counter = 0;
        for (const orb of world.orbs.values()) {
            if (!orb.owner) counter++;
        }
        return counter;
    }

    tick(game: Game) {
        if (game.world.tickCounter % 1000 === 0) {
            if (this.getUnclaimedOrbs(game.world).length < 5) {
                this.discover(game.world);
            }
        }
    }

    discover(world: World): Orb {
        const orb = this.orbGenerator.generate(world);
        world.orbs.add(orb);
        return orb;
    }

    claim(orb: Orb, profile: Profile): boolean {
        if (orb.owner) return false;
        orb.owner = profile;
        profile.ownedOrbs.add(orb);
        return true;
    }
}