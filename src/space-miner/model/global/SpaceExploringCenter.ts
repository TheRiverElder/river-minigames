import { int } from "../../../libs/CommonTypes";
import OrbGenerator from "../generation/OrbGenerator";
import OrbMiningLicenceItem from "../item/OrbMiningLisenceItem";
import Orb from "../orb/Orb";
import Game from "./Game";
import Profile from "./Profile";
import World from "./World";


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

    preTick(_game: Game) { }
    postTick(_game: Game) { }

    tick(game: Game) {
        if (game.world.tickCounter % 1000 === 0) {
            if (this.getUnclaimedOrbs(game.world).length < 5) {
                const orb = this.discover(game.world);
                game.shop.items.push(new OrbMiningLicenceItem(game, orb));
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