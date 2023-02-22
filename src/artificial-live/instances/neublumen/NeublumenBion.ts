import Bion from "../../Bion";
import MessagePack from "../../MessagePack";
import NeublumenBranch from "./NeublumenBranch";
import { MESSAGE_PACK_TYPE_GROW } from "./NeublumenMessagePackTypes";

export default class NeublumenBion extends Bion {
    
    constructor(gene: Uint8Array) {
        super(gene);

        const core = new NeublumenBranch(this);
        this.parts.set(core.uid, core);
    }

    tick(): void {
        this.submit(new MessagePack(MESSAGE_PACK_TYPE_GROW, 1));
    }
}