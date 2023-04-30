import { drawChamferRect } from "../../../../libs/graphics/Graphics";
import Vector2 from "../../../../libs/math/Vector2";
import Part from "../../../Part";
import Cell from "../../../program/Cell";
import Instruction from "../../../program/Instruction";
import Tile from "../../../program/Tile";
import { consumeByMinimumRate } from "../../../util/Utils";
import GrowInstruction from "../instructions/GrowInstruction";
import { PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_SIZE, PROPERTY_TYPE_WATER } from "../NeublumenPropertyTypes";

export default class GrowTile extends Tile {
    
    get terminal(): boolean {
        return true;
    }

    execute(cell: Cell, part: Part): void {
        const outputSize = 0.20;

        const rate = consumeByMinimumRate(part.properties, [
            [PROPERTY_TYPE_WATER, 0.15],
            [PROPERTY_TYPE_NUTRITION, 0.05],
        ]);

        part.properties.mutate(PROPERTY_TYPE_SIZE, +rate * outputSize);
    }

    compile(output: Instruction[]): void {
        output.push(new GrowInstruction());
    }

    copy(): Tile {
        return new GrowTile(this.type, this.direction);    
    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#252e39";
        drawChamferRect(g, 1, 0.2);
        g.fill();

        g.lineCap = "round";
        g.lineWidth = 0.08;
        g.strokeStyle = "#7f7f7f";

        const center = new Vector2(0.5, 0.5);
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = i * Math.PI * 2 / count;
            g.beginPath();
            g.moveTo(...center.add(Vector2.fromPolar(angle, 0.15)).toArray());
            g.lineTo(...center.add(Vector2.fromPolar(angle, 0.35)).toArray());
            g.stroke();
        }

        g.beginPath();
        g.arc(...center.toArray(), 0.15, 0, Math.PI * 2);
        g.stroke();
    }

}