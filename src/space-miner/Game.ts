import { int, Productor } from "../libs/CommonTypes";
import ListenerManager from "../libs/management/ListenerManager";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Miner from "./model/Miner";
import MineType from "./model/MineType";
import Orb from "./model/Orb";
import Profile from "./model/Profile";
import Shop from "./model/Shop";

export default class Game {
    
    tickCounter: int = 0;

    readonly profile = new Profile();

    readonly shop = new Shop();

    readonly mineTypes = new Registry<string, MineType>(type => type.name); 

    readonly orbs = new Registry<int, Orb>(orb => orb.uid); 
    
    readonly onMessageListener = new ListenerManager<string>();

    readonly uidGenerator = new IncrementNumberGenerator(1);

    // orbGenerator: Productor<Game, Orb>;

    // constructor(orbGenerator: Productor<Game, Orb>) {
    //     this.orbGenerator = orbGenerator;
    // }

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.orbs.add(orb);
        return orb;
    }

    tick() {
        this.orbs.values().forEach(orb => orb.tick());
        this.tickCounter++;
    }


    getPriceOf(type: MineType) {
        return (type.hardness + 0.5) * 15;
    }



    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.maxEnergy - miner.energy, this.profile.account / energyPrice);
        this.profile.account -= refilledEnergy * energyPrice;
        miner.energy += refilledEnergy;
    }
}