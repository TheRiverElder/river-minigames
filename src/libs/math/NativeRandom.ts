import { double } from "../CommonTypes";
import RandomAdapter from "./RandomAdapter";

export default class NativeRandom extends RandomAdapter {

    static readonly INSTANCE = new NativeRandom();

    override next(): double {
        return Math.random();
    }
    
}