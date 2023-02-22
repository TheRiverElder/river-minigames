import Bion from "./Bion";

export default class Game {
    public readonly bions: Array<Bion> = []; 

    public setup() {
        // const bion;
        // this.bions.push(bion);
    }

    public tick() {
        this.bions.forEach(bion => bion.tick());
    }
    
}