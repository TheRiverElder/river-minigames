import { double } from "../CommonTypes";
import RandomAdapter from "./RandomAdapter";

export default class PseudoRandom extends RandomAdapter {

    private seed: number;

    constructor(seed: number = Date.now()) {
        super();
        this.seed = Math.floor(seed) / Number.MAX_SAFE_INTEGER;
    }

    override next(): double {
        this.seed = (Math.floor(this.seed * 9301 + 49297) % 233280) / 233280.0;
        return this.seed;
    }

}