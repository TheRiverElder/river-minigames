import { int, Productor } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import MineType from "./model/MineType";
import Orb from "./model/Orb";

export default class Game {

    readonly mineTypes = new Registry<string, MineType>(type => type.name); 

    readonly orbs = new Registry<int, Orb>(orb => orb.uid); 

    readonly uidGenerator = new IncrementNumberGenerator(1);

    orbGenerator: Productor<Game, Orb>;

    constructor(orbGenerator: Productor<Game, Orb>) {
        this.orbGenerator = orbGenerator;
    }

    // createAndAddOrb(): Orb {
    //     const orb = new Orb(this.uidGenerator.generate(), "aaa", [
            
    //     ]);
    // }
}