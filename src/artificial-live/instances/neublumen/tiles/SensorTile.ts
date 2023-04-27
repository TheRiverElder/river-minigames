import { drawChamferRect } from "../../../../libs/graphics/Graphics";
import Part from "../../../Part";
import Cell from "../../../program/Cell";
import Direction from "../../../program/Direction";
import Tile from "../../../program/Tile";
import TileType from "../../../program/TileType";
import { PropertyType } from "../../../PropertyManager";
import { PROPERTY_TYPE_SIZE } from "../NeublumenPropertyTypes";

export default class SensorTile extends Tile {

    public readonly target: PropertyType;

    constructor(target: PropertyType, type: TileType, direction?: Direction) {
        super(type, direction);
        this.target = target;
    }

    get activative(): boolean {
        return true;
    }
    
    execute(cell: Cell, part: Part): void {
        const value = part.properties.get(this.target);
        const size = part.properties.get(PROPERTY_TYPE_SIZE);
        const ratio = value / size;
        cell.sendArgument(ratio, part);
    }
    
    copy(): Tile {
        return new SensorTile(this.target, this.type, this.direction);   
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

        g.beginPath();
        g.arc(-0.2, 0, 0.2, -Math.PI / 2, Math.PI / 2);
        g.stroke();

        g.restore();
    }

}