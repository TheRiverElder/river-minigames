import { drawChamferRect } from "../../../../libs/graphics/Graphics";
import Vector2 from "../../../../libs/math/Vector2";
import Instruction from "../../../program/Instruction";
import Tile from "../../../program/Tile";
import NopInstruction from "../instructions/NopInstruction";

export default class DecadeTile extends Tile {
    get activative(): boolean {
        return false;
    }
    
    get terminal(): boolean {
        return true;
    }

    compile(output: Instruction[]): void {
        output.push(new NopInstruction());
    }

    copy(): Tile {
        return new DecadeTile(this.type, this.parameters.map(p => p.copy()), this.direction);   
    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#252e39";
        drawChamferRect(g, 1, 0.2);
        g.fill();

        g.lineCap = "round";
        g.lineWidth = 0.06;
        g.strokeStyle = "#7f7f7f";

        const center = new Vector2(0.5, 0.5);
        const count = 4;
        const angleStep = Math.PI * 2 / (count * 2);
        const angleInitial = angleStep / 2;
        for (let i = 0; i < count; i++) {
            const angleStart = i * 2 * angleStep + angleInitial;
            const angleEnd = (i * 2 + 1) * angleStep + angleInitial;
            g.beginPath();
            g.moveTo(...center.add(Vector2.fromPole(angleStart, 0.15)).toArray());
            g.arc(...center.toArray(), 0.35, angleStart, angleEnd);
            g.lineTo(...center.add(Vector2.fromPole(angleEnd, 0.15)).toArray());
            g.stroke();
        }
    }

}