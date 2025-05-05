import { clamp } from "lodash";
import { Pair } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import { RGB, rgbFromInt, styleColorRgb } from "../../libs/math/Colors";

export interface HeatMapRendererProps {
    readonly scalar?: number;
    readonly radius?: number;
    readonly width?: number;
    readonly height?: number;
    readonly normalize: (value: number) => number;
}


export interface HeatMapRenderingOptions {
    readonly data: Array<Pair<Vector2, number>>;
    readonly resizeCanvas?: boolean;
}

export default class HeatMapRenderer {

    scalar: number;
    radius: number;
    width?: number;
    height?: number;
    normalize: (value: number) => number;

    constructor(props: HeatMapRendererProps) {
        this.scalar = props.scalar ?? 20.0;
        this.radius = props.radius ?? 1.0;
        this.width = props.width;
        this.height = props.height;
        this.normalize = props.normalize;
    }

    public render(canvas: HTMLCanvasElement, options: HeatMapRenderingOptions) {
        // 绘制热力图
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("canvas context is not available");
        }

        const { data, resizeCanvas = true } = options;

        if (resizeCanvas) {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        } else {
            canvas.width = this.width ?? canvas.width;
            canvas.height = this.height ?? canvas.height;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width ?? canvas.width, this.height ?? canvas.height);

        ctx.save();
        ctx.scale(this.scalar, this.scalar);
        // 根据data中的数据，计算每个点的颜色值
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const [position, value] = point;
            const { x, y } = position;
            const cx = x + 0.5;
            const cy = y + 0.5;

            // 计算颜色值
            const color = this.calculateColor(value);

            // 绘制gradient
            const gradient = ctx.createRadialGradient(cx, cy, 0.3 * this.radius, cx, cy, this.radius);

            gradient.addColorStop(0, styleColorRgb(color, 1));
            gradient.addColorStop(1, styleColorRgb(color, 0));

            ctx.fillStyle = gradient;
            ctx.fillRect(cx - this.radius, cy - this.radius, 2 * this.radius, 2 * this.radius);
        }

        ctx.restore();
    }

    calculateColor(value: number): RGB {
        // 先用atan函数将数值限制再0到1之间
        const normalizedValue = this.normalize(value);
        // 最高值对应#ff0000，最低值对应#0000ff
        if (normalizedValue < 1 / 3) {
            return [0, 0, 3 * normalizedValue];
        } else if (normalizedValue < 2 / 3) {
            return [3 * normalizedValue - 1, 0, 1];
        } else {
            return [1, 0, 3 * (1 - normalizedValue)];
        }
    }


    // 当x为halfValue时，返回0.5
    public static createAtanNormalizer(halfValue: number = 1) {
        return (n: number) => clamp(Math.atan(n / halfValue) / (Math.PI / 2), 0, 1);
    }
}