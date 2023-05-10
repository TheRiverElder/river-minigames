import Bion from "./Bion";
import BionEnvironment from "./BionEnvironment";

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