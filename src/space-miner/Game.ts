import { int, Productor } from "../libs/CommonTypes";
import ListenerManager from "../libs/management/ListenerManager";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Miner from "./model/Miner";
import MineType from "./model/MineType";
import Orb from "./model/Orb";
import Profile from "./model/Profile";
import Shop from "./model/Shop";
import SpaceExploringCenter from "./model/SpaceExploringCenter";

export default class Game {
    
    tickCounter: int = 0;

    readonly profile = new Profile();
    readonly shop = new Shop();
    readonly spaceExploringCenter = new SpaceExploringCenter(this);

    readonly mineTypes = new Registry<string, MineType>(type => type.name); 
    
    readonly onMessageListener = new ListenerManager<string>();

    readonly uidGenerator = new IncrementNumberGenerator(1);

    // orbGenerator: Productor<Game, Orb>;

    // constructor(orbGenerator: Productor<Game, Orb>) {
    //     this.orbGenerator = orbGenerator;
    // }

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.profile.orbs.add(orb);
        return orb;
    }

    tick() {
        this.spaceExploringCenter.tick();
        Array.from(this.profile.orbs.values()).forEach(orb => orb.tick());
        this.tickCounter++;
    }

    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.maxEnergy - miner.energy, this.profile.account / energyPrice);
        this.profile.account -= refilledEnergy * energyPrice;
        miner.energy += refilledEnergy;
    }
}