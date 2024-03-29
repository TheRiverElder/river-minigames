import { drawChamferRect } from "../../../../libs/graphics/Graphics";
import { isEmpty, requireNonNull } from "../../../../libs/lang/Objects";
import Part from "../../../model/Part";
import Cell from "../../../program/Cell";
import Tile from "../../../program/Tile";

export default class ConveyorTile extends Tile {
    
    get terminal(): boolean {
        return false;
    }
    
    get activative(): boolean {
        return true;
    }

    execute(cell: Cell, part: Part): void {
        const args = cell.getArgs(part);
        const index = args.findIndex(e => isEmpty(e));
        if (index < 0) return;
        const arg = args[index];
        cell.sendArgument(arg, part);
        cell.program.schedule(requireNonNull(cell.get(this.direction)));
        delete args[index];
    }

    copy(): Tile {
        return new ConveyorTile(this.type, this.direction);   
    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#252e39";
        drawChamferRect(g, 1, 0.2);
        g.fill();
        
        const angle = this.direction.offset.angle;

        g.save();
        g.translate(0.5, 0.5);
        g.rotate(angle);

        g.lineCap = "round";
        g.lineWidth = 0.08;
        g.strokeStyle = "#7f7f7f";

        g.beginPath();
        g.moveTo(0.1, -0.2);
        g.lineTo(0.3, 0.0);
        g.lineTo(0.1, 0.2);
        g.moveTo(0, 0.0);
        g.lineTo(0.3, 0.0);
        g.stroke();

        g.beginPath();
        g.arc(-0.2, 0, 0.2, -Math.PI / 2, Math.PI / 2);
        g.stroke();

        g.beginPath();
        g.arc(-0.2, 0, 0.05, 0, Math.PI * 2);
        g.stroke();

        g.restore();
    }

}