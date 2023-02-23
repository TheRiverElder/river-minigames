import Vector2 from "../../../libs/math/Vector2";
import Bion from "../../Bion";
import NeublumenBranch from "./NeublumenBranch";

export default class NeublumenBion extends Bion {
    
    constructor(gene: Uint8Array) {
        super(gene);

        const core = new NeublumenBranch(this, new Vector2(0, 0));
        this.board.set(...core.position.toArray(), core);
        this.parts.set(core.uid, core);
    }
}