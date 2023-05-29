import { rand, randInt, randOne, randSome } from "../../libs/math/Mathmatics";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import { RESOURCE_TYPE_EMPTY } from "../ResourceTypes";
import ResourceItem from "./item/ResourceItem";
import Orb from "./Orb";
import Profile from "./Profile";
import World from "./World";

export default class SpaceExploringCenter {

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
        const uid = world.genOrbUid();
        const orb = new Orb(world, uid, `${randOne(ORB_NAMES)}-${uid.toString(16)}`, {
                radius: rand(40, 60),
                color: randInt(0, 0x01000000),
                position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
                forward: rand(0, 2 * Math.PI),
                rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
                revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
            }, 
            this.randomMines(world),
        );
        world.orbs.add(orb);
        return orb;
    }
    
    private randomMines(world: World): Array<ResourceItem> {
        const mineTypes = world.mineTypes.values();
        const typeAmount = randInt(2, mineTypes.length);
        const mineables = randSome(mineTypes, typeAmount);
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