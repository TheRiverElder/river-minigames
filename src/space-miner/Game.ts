import { double, int, Pair } from "../libs/CommonTypes";
import ListenerManager from "../libs/management/ListenerManager";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import { MINE_TYPE_HYTROGEN, MINE_TYPE_URANIUM } from "./MineTypes";
import MineType from "./model/MineType";
import Orb from "./model/Orb";

export default class Game {
    
    readonly mineTypes = new Registry<string, MineType>(type => type.name); 

    readonly orbs = new Registry<int, Orb>(orb => orb.uid); 
    
    readonly onMessageListener = new ListenerManager<string>();

    readonly uidGenerator = new IncrementNumberGenerator(1);

    // orbGenerator: Productor<Game, Orb>;

    // constructor(orbGenerator: Productor<Game, Orb>) {
    //     this.orbGenerator = orbGenerator;
    // }

    createAndAddOrb(): Orb {
        const orb = new Orb(this.uidGenerator.generate(), "aaa", [
            [MINE_TYPE_HYTROGEN, 32445],
            [MINE_TYPE_URANIUM, 5459],
        ] as Pair<MineType, double>[]);
        this.orbs.add(orb);
        return orb;
    }

    tick() {
        for (const orb of this.orbs.values()) {
            for (const miner of Array.from(orb.miners)) {
                miner.drain(orb);
            }
        }
    }
}