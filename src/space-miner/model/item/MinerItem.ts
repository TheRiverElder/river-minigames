import { randomMiner } from "../../Test";
import Item from "./Item";

export default class MinerItem extends Item {

    onUse(): void {
        const miner = randomMiner(this.game);
        this.game.profile.miners.add(miner);
    }

}