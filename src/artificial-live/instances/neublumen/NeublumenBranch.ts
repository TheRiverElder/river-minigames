import { double } from "../../../libs/CommonTypes";
import { drawChamferRect } from "../../../libs/graphics/Graphics";
import { filterNotNull } from "../../../libs/lang/Collections";
import { interpolateRgb, RGB, rgbFromInt, styleColorRgb } from "../../../libs/math/Colors";
import { checkLessThan, constrains, randOneOrNull } from "../../../libs/math/Mathmatics";
import Vector2 from "../../../libs/math/Vector2";
import MessagePack from "../../MessagePack";
import Part from "../../Part";
import Direction from "../../program/Direction";
import { MESSAGE_PACK_TYPE_GROW } from "./NeublumenMessagePackTypes";
import { PROPERTY_TYPE_NUTRITION } from "./NeublumenPropertyTypes";

export default class NeublumenBranch extends Part {

    public nutritionPerSize = 10;
    public growingSpeed: double = 0.02;
    public size: double = 0;

    tick(): void {
        this.properties.set(PROPERTY_TYPE_NUTRITION, 100);
        const deltaNutrition = Math.min(this.properties.get(PROPERTY_TYPE_NUTRITION), this.nutritionPerSize * constrains(this.growingSpeed, 0, 1 - this.size));
        this.properties.mutate(PROPERTY_TYPE_NUTRITION, -deltaNutrition);
        this.size = constrains(this.size + deltaNutrition / this.nutritionPerSize, 0, 1);

        if (this.size < 0.9 || !checkLessThan(0.05)) return;

        const pos = randOneOrNull([
            Direction.UP, 
            Direction.DOWN, 
            Direction.LEFT, 
            Direction.RIGHT,
        ].map(direction => this.position.add(direction.offset))
        .filter(pos => this.bion.board.contains(...pos.toArray()) && !this.bion.board.getOrNull(...pos.toArray())));
        if (!pos) return;

        const part = new NeublumenBranch(this.bion, pos);
        this.bion.board.set(...pos.toArray(), part);
    }

    receive(pack: MessagePack): void {
        switch (pack.type) {
            case MESSAGE_PACK_TYPE_GROW:
                break;
        
            default:
                break;
        }
    }

    render(g: CanvasRenderingContext2D): void {
        // console.log("size = ", this.size);

        const radiusRatio = 1 / 8;
        const radius = this.size * radiusRatio;
        const gap = (1 - this.size) / 2;
        const color = this.getColor();

        g.fillStyle = styleColorRgb(color);

        g.save();
        g.translate(gap, gap);
        drawChamferRect(g, this.size, radius);
        g.fill();
        g.restore()

        filterNotNull([
            Direction.UP, 
            Direction.DOWN, 
            Direction.LEFT, 
            Direction.RIGHT,
        ].map(direction => this.bion.board.getOrNull(...this.position.add(direction.offset).toArray())))
        .forEach(part => {
            if (part.position.x < this.position.x || part.position.y < this.position.y) return;
            if (!(part instanceof NeublumenBranch)) return;
            const width = Math.min(part.size, this.size);
            g.lineWidth = width * 0.618;

            const offset = part.position.sub(this.position);

            const gradient = g.createLinearGradient(0.5, 0.5, ...offset.toArray());
            gradient.addColorStop(0, styleColorRgb(color));
            gradient.addColorStop(1, styleColorRgb(part.getColor()));
            g.strokeStyle = gradient;
            g.beginPath();
            g.moveTo(0.5, 0.5);
            g.lineTo(...new Vector2(0.5, 0.5).add(offset).toArray())
            g.stroke()
        });
    }

    getColor(): RGB {
        return interpolateRgb(rgbFromInt(0x000000), rgbFromInt(0x3f2f0f), this.size);
    }

}