import { Pair, double, int } from "../../libs/CommonTypes";
import Miner from "./Miner";
import MineSource from "./MineSource";
import MineType from "./MineType";

export default class Orb extends MineSource {
    readonly uid: int;
    readonly name: string;
    readonly miners: Set<Miner> = new Set();
    
    constructor(uid: int, name: string, mineTypes: Iterable<Pair<MineType, double>>) {
        super(mineTypes);
        this.uid = uid;
        this.name = name;
    }

}