import { drawChamferRect } from "../../../../libs/graphics/Graphics";
import Instruction from "../../../program/Instruction";
import Tile from "../../../program/Tile";
import NopInstruction from "../instructions/NopInstruction";

export default class ActivatorTile extends Tile {
    
    get terminal(): boolean {
        return false;
    }
    
    get activative(): boolean {
        return true;
    }

    compile(output: Instruction[]): void {
        output.push(new NopInstruction());
    }

    copy(): Tile { 
        return new ActivatorTile(this.type, this.parameters.map(p => p.copy()), this.direction);     
    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#252e39";
        drawChamferRect(g, 1, 0.2);
        g.fill();
        
        const angle = this.direction.offset.angle();

        g.save();
        g.translate(0.5, 0.5);
        g.rotate(angle);

        g.lineCap = "round";
        g.lineWidth = 0.1;
        g.strokeStyle = "#7f7f7f";

        g.beginPath();
        g.moveTo(0.1, -0.2);
        g.lineTo(0.3, 0.0);
        g.lineTo(0.1, 0.2);
        g.moveTo(-0.3, 0.0);
        g.lineTo(0.3, 0.0);
        g.stroke();

        g.restore();
    }

}