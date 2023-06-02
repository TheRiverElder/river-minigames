import { rand, randInt, randSome } from "../../libs/math/Mathmatics";
import Game from "../Game";
import { NATURAL_RESOURCE_TYPES } from "./ResourceTypes";
import ResourceItem from "./item/ResourceItem";
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
    
    private randomMines(world: World): Array<ResourceItem> {
        const typeAmount = randInt(2, NATURAL_RESOURCE_TYPES.length);
        const mineables = randSome(NATURAL_RESOURCE_TYPES, typeAmount);
        return mineables.map(type => new ResourceItem(type, rand(5000, 60000)));
    }

    claim(profile: Profile, orb: Orb) {
        if (orb.owner) return;
        orb.owner = profile;
        profile.ownedOrbs.add(orb);
    }
}

const ORB_NAMES = [
    "Mars",
    "Jupiter",
    "Saturn",
    "Mercury",
    "Uranus",
    "Neptune",
];