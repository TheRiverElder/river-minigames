
import { double } from "../../../../libs/CommonTypes";
import SimpleStorage from "./SimpleStorage";

export default class Inventory extends SimpleStorage {

    override readonly capacity: double;

    constructor(capacity: double = Number.POSITIVE_INFINITY) {
        super();
        this.capacity = capacity;
    }
    
}