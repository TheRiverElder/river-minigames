import { double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Inventory from "./Inventory";
import ResourceType from "./ResourceType";
import Orb from "./Orb";
import Game from "../Game";

export default class Miner {
    energy: double = 0;
    maxEnergy: double = 0;
    strength: double = 1;
    size: double = 10;
    mineables = new Set<ResourceType>();
    inventory = new Inventory(); 
    orb: Nullable<Orb> = null;
    depth: double = 0;
    surfacePosition: double = 0; // 在地表的位置

    drain() {
        const orb = this.orb;
        if (orb) {
            this.mineables.forEach(mineable => {
                orb.onDrain(mineable, this);
            });
        }
    }

    tick(game: Game) {
        const energyCost = 10;
        if (this.energy >= energyCost) {
            this.energy -= energyCost;
            this.drain();
        }
    }
}