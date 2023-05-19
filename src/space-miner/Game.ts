import { double, int, Pair } from "../libs/CommonTypes";
import ListenerManager from "../libs/management/ListenerManager";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import { rand, randInt } from "../libs/math/Mathmatics";
import Vector2 from "../libs/math/Vector2";
import { MINE_TYPE_HYTROGEN, MINE_TYPE_URANIUM } from "./MineTypes";
import MineType from "./model/MineType";
import Orb from "./model/Orb";

export default class Game {
    
    tickCounter: int = 0;

    readonly mineTypes = new Registry<string, MineType>(type => type.name); 

    readonly orbs = new Registry<int, Orb>(orb => orb.uid); 
    
    readonly onMessageListener = new ListenerManager<string>();

    readonly uidGenerator = new IncrementNumberGenerator(1);

    // orbGenerator: Productor<Game, Orb>;

    // constructor(orbGenerator: Productor<Game, Orb>) {
    //     this.orbGenerator = orbGenerator;
    // }

    createAndAddOrb(): Orb {
        const orb = new Orb(
            this.uidGenerator.generate(), 
            "aaa", {
                radius: rand(40, 60),
                color: 0x66ccff,
                position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
                forward: rand(0, 2 * Math.PI),
                rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
                revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
            }, [
                [MINE_TYPE_HYTROGEN, 32445],
                [MINE_TYPE_URANIUM, 5459],
            ] as Pair<MineType, double>[],
        );
        this.orbs.add(orb);
        return orb;
    }

    tick() {
        this.orbs.values().forEach(orb => orb.tick());
        this.tickCounter++;
    }
}