import Bion from "./model/Bion";
import BionEnvironment from "./model/BionEnvironment";

export default class Game {
    public readonly bions: Array<Bion> = []; 

    public setup() {
        // const bion;
        // this.bions.push(bion);
    }

    public tick(env: BionEnvironment) {
        this.bions.forEach(bion => bion.tick(env));
    }
    
}