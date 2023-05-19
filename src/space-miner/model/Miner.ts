import { double, Pair } from "../../libs/CommonTypes";
import Inventory from "./Inventory";
import MineSource from "./MineSource";

export default class Miner {
    strength: double = 1;
    inventory = new Inventory();
    depth: double = 0;

    drain(source: MineSource) {
        source.onDrain(5, this);
    }
}