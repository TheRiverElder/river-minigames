import { double } from "../../../libs/CommonTypes";
import MessagePack from "../../MessagePack";
import Part from "../../Part";
import { MESSAGE_PACK_TYPE_GROW } from "./NeublumenMessagePackTypes";

export default class NeublumenBranch extends Part {

    public length: double = 0;

    receive(pack: MessagePack): void {
        switch (pack.type) {
            case MESSAGE_PACK_TYPE_GROW:
                this.length += pack.amount;
                break;
        
            default:
                break;
        }
    }

    render(g: CanvasRenderingContext2D): void {
        g.lineWidth = 3;
        g.strokeStyle = "#000000";
        g.moveTo(0, 0);
        g.lineTo(0, this.length);
        g.stroke();
    }

}