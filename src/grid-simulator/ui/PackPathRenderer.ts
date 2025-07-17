import { Pair } from "../../libs/CommonTypes";
import { RGB, rgbFromInt, styleColorRgb } from "../../libs/math/Colors";
import Vector2 from "../../libs/math/Vector2";
import GameClient from "../core/game/GameClient";
import ValueType from "../core/value/ValueType";


export interface PackPathRendererProps {
    readonly scalar: number;
    readonly length: number;
    readonly client: GameClient;
    readonly defaultColor: RGB;
    readonly maxLineWidth: number;
    readonly defaultNormalizeFunction: (value: number) => number;
}

export interface PackPathRenderingOptions {
    readonly data: Array<PackPathRenderedDataItem>;
}

export interface PackPathRenderedDataItem {
    position: Vector2;
    direction: Vector2;
    type: ValueType;
    value: number;
}

export default class PackPathRenderer {

    readonly scalar: number;
    readonly length: number;
    readonly defaultColor: RGB;
    readonly maxLineWidth: number;
    readonly defaultNormalizeFunction: (value: number) => number;

    readonly client: GameClient;

    constructor(props: PackPathRendererProps) {
        this.scalar = props.scalar;
        this.length = props.length;
        this.client = props.client;
        this.defaultColor = props.defaultColor;
        this.maxLineWidth = props.maxLineWidth;
        this.defaultNormalizeFunction = props.defaultNormalizeFunction;
    }

    render(canvas: HTMLCanvasElement, options: PackPathRenderingOptions): void {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("canvas context is not available");
        }
        
        const { data } = options;

        ctx.lineWidth = 0.05;
        ctx.lineCap = 'round';

        ctx.save();
        ctx.scale(this.scalar, this.scalar);
        
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const { position, direction, type, value } = point;
            const { x, y } = position;
            const { x: dx, y: dy } = direction;
            const cx = x + 0.5;
            const cy = y + 0.5;

            // 计算颜色值
            const color = this.client.registryValueDisplayConfig.get(type).orNull()?.presentColor ?? this.defaultColor;
            ctx.strokeStyle = styleColorRgb(color);

            const lineWidth = this.maxLineWidth * (0.3 + 0.7 * this.defaultNormalizeFunction(value));
            
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(cx + 0.5 * (1 - this.length) * dx, cy + 0.5 * (1 - this.length) * dy);
            ctx.lineTo(cx + dx * 0.5 * (1 + this.length), cy + dy * 0.5 * (1 + this.length));
            ctx.stroke();
        }

        ctx.restore();
    }

}