import { Consumer, double, int, Pair } from "../../../libs/CommonTypes";
import { ColorData, colorFrom, int2Color } from "../../../libs/graphics/Graphics";
import { createArray } from "../../../libs/lang/Collections";
import { stringHashCode } from "../../../libs/lang/Constants";
import { Nullable } from "../../../libs/lang/Optional";
import { constrains, randOne, TWO_PI } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import Random from "../../../libs/math/Random";
import Vector2 from "../../../libs/math/Vector2";
import { OrbInfoModel, OrbModel } from "../../model/orb/Orb";
import ResourceType from "../../model/misc/ResourceType";

export function drawOrbBody(orb: OrbInfoModel, g: CanvasRenderingContext2D) {

    const radius = (g.canvas.width + g.canvas.height) / 2;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(g.canvas.width / 2, g.canvas.height / 2);

    const minRadius = Math.min(g.canvas.width, g.canvas.height) / 2;
    if (radius > minRadius) g.scale(minRadius / radius, minRadius / radius);


    g.save();

    if (orb.name === 'staller') drawStellarOrb(orb, g);
    else drawTerraLikeOrb(orb, g);

    g.restore();
}

export function drawTerraLikeOrb(orb: OrbInfoModel, g: CanvasRenderingContext2D) {
    const random = new PseudoRandom(orb.uid);
    const radius = (g.canvas.width + g.canvas.height) / 2;

    // 绘制底色
    g.fillStyle = int2Color(orb.body.color);
    g.beginPath();
    g.arc(0, 0, radius, 0, TWO_PI);
    g.clip();
    g.fill();

    // 绘制图案
    randOne(drawers, random)({
        orb,
        random,
        graphics: g,
    });
}

export function drawStellarOrb(orb: OrbInfoModel, g: CanvasRenderingContext2D) {
    const radius = (g.canvas.width + g.canvas.height) / 2;
    // 绘制底色
    g.fillStyle = int2Color(orb.body.color);
    g.beginPath();
    g.arc(0, 0, radius, 0, TWO_PI);
    g.clip();
    g.fill();
}

// 绘制一个光影遮罩，光面在正右
export function drawLightAndShadow(radius: double, g: CanvasRenderingContext2D) {
    // 绘制光影
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(radius, radius);

    // const lightSize = radius * 1;
    const lightDirection = Vector2.fromPolar(0, radius);

    const gradientLight = g.createLinearGradient(...lightDirection.mul(-1).toArray(), ...lightDirection.toArray());
    gradientLight.addColorStop(0.000, "white");
    gradientLight.addColorStop(0.382, "#00000080");
    gradientLight.addColorStop(0.618, "black");
    gradientLight.addColorStop(1.000, "black");
    g.fillStyle = gradientLight;
    g.beginPath();
    g.arc(0, 0, radius, 0, TWO_PI);
    g.fill();

    g.restore();
}

// 绘制一个光影遮罩，光面在正右
export function drawLightAndShadow1(radius: double, g: CanvasRenderingContext2D) {
    // 绘制光影
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(radius, radius);

    const lightSize = radius * 1;
    const lightDirection = Vector2.fromPolar(0, radius);

    const gradientLight = g.createRadialGradient(0, 0, (radius - lightSize), ...lightDirection.toArray(), radius + lightSize);
    gradientLight.addColorStop(0.0, "transparent");
    gradientLight.addColorStop(1.0, "white");
    g.fillStyle = gradientLight;
    g.beginPath();
    g.arc(0, 0, radius, 0, TWO_PI);
    g.fill();

    const gradientDark = g.createRadialGradient(0, 0, (radius - lightSize), ...lightDirection.mul(-1).toArray(), radius + lightSize);
    gradientDark.addColorStop(0.0, "transparent");
    gradientDark.addColorStop(1.0, "black");
    g.fillStyle = gradientDark;
    g.beginPath();
    g.arc(0, 0, radius, 0, TWO_PI);
    g.fill();

    g.restore();
}

// 绘制箭头指示挖矿姬的位置
export function drawMinerPointer(size: double, g: CanvasRenderingContext2D) {
    g.fillStyle = "white";
    g.strokeStyle = "black";
    g.lineWidth = 3;

    g.beginPath();
    g.moveTo(size / 2, size);
    g.lineTo(0, size * 0.6);
    g.lineTo(0, size * 0.3);
    g.lineTo(size, size * 0.3);
    g.lineTo(size, size * 0.6);
    g.closePath();
    g.fill();
    g.stroke();
}

// 绘制挖矿姬工作时动画用的图标
export function drawMinerIcon(size: double, g: CanvasRenderingContext2D) {
    g.save();
    g.translate(size / 2, size / 2);

    g.fillStyle = "white";
    g.strokeStyle = "white";
    g.lineWidth = 0.1 * size;

    const teethAmount = 8;
    for (let i = 0; i < teethAmount; i++) {
        g.save();
        g.rotate(TWO_PI * (i / teethAmount));

        g.beginPath();
        g.moveTo(0.1 * size, 0);
        g.lineTo(0.4 * size, 0);
        g.lineTo(0.4 * size, 0.1 * size);
        g.closePath();
        g.fill();

        g.restore();
    }

    g.beginPath();
    g.arc(0, 0, size / 2 * 0.9, 0, TWO_PI);
    g.stroke();

    g.restore();
}

export interface DrawingContext {
    orb: OrbInfoModel;
    random: Random;
    graphics: CanvasRenderingContext2D;
}

export const drawers: Array<Consumer<DrawingContext>> = [
    drawSpiral,
    drawStar,
    drawString,
];

export function drawSpiral(context: DrawingContext) {
    const { random, graphics } = context;
    const radius = (graphics.canvas.width + graphics.canvas.height) / 2;
    const startAngle = random.nextFloat(0, TWO_PI);
    const speed = random.nextFloat(5, 20); // 该螺旋转一周所提升的高度

    // console.log("startAngle", startAngle);
    // console.log("speed", speed);

    // 采用错圆法

    graphics.strokeStyle = "#ffffff";
    graphics.lineWidth = 3;
    graphics.beginPath();
    for (let layer = 0; layer * speed < radius; layer++) {
        graphics.arc(0, 0, layer * speed, startAngle, startAngle + Math.PI);
        graphics.arc(0.5 * speed, 0, (layer + 0.5) * speed, startAngle + Math.PI, startAngle + TWO_PI);
    }
    graphics.stroke();
}

export function drawStar(context: DrawingContext) {
    const { random, graphics } = context;
    const radius = (graphics.canvas.width + graphics.canvas.height) / 2;

    graphics.strokeStyle = "#ffffff";
    graphics.lineWidth = 3;
    graphics.beginPath();
    const cornerAmount = random.nextInt(4, 10);
    for (let i = 0; i < cornerAmount; i++) {
        const theta = random.nextFloat(0, TWO_PI);
        const rho = random.nextFloat(0.2, 0.9) * radius;
        const offset = Vector2.fromPolar(theta, rho);
        graphics.lineTo(...offset.toArray());
    }
    graphics.closePath();
    graphics.stroke();

}

export function drawString(context: DrawingContext) {
    const { random, graphics } = context;
    const radius = (graphics.canvas.width + graphics.canvas.height) / 2;
    // console.log("drawString", orb.name);

    graphics.strokeStyle = "#ffffff";
    graphics.lineWidth = 3;
    graphics.beginPath();
    const pointAmount = random.nextInt(4, 10);
    const points = createArray(pointAmount, () => Vector2.fromPolar(random.nextFloat(0, TWO_PI), random.nextFloat(0.2, 0.9) * radius));
    const amplifier = 0.618 * radius;
    const angles = createArray(pointAmount, () => Vector2.fromPolar(random.nextFloat(0, TWO_PI), 1).mul(amplifier));
    graphics.moveTo(...points[0].toArray());
    for (let i = 0; i < pointAmount; i++) {
        const lastIndex = (pointAmount + i - 1) % pointAmount;
        const point1 = points[lastIndex];
        const point2 = points[i];
        const angle1 = angles[lastIndex];
        const angle2 = angles[i];

        // const amplifier = point1.distanceTo(point2) / 3;

        const controlPoint1 = point1.add(angle1);
        const controlPoint2 = point2.sub(angle2);

        graphics.bezierCurveTo(...controlPoint1.toArray(), ...controlPoint2.toArray(), ...point2.toArray());
    }
    graphics.closePath();
    graphics.stroke();

}

export function drawWave(context: DrawingContext) {
    // const { random, graphics } = context;

}

export function drawCrosslink(context: DrawingContext) {
    // const { random, graphics } = context;

}

export function drawResourceTexture1(type: ResourceType, size: double, g: CanvasRenderingContext2D) {
    g.save();
    g.translate(size / 2, size / 2);

    const random = new PseudoRandom(stringHashCode(type.name));
    const pointAmount = random.nextInt(6, 12);

    function fillTriangle(p1: Vector2, p2: Vector2, p3: Vector2) {
        g.fillStyle = colorFrom(
            random.nextFloat(0, 1),
            random.nextFloat(0, 1),
            random.nextFloat(0, 1),
        );
        g.beginPath();
        g.moveTo(...p1.toArray());
        g.lineTo(...p2.toArray());
        g.lineTo(...p3.toArray());
        g.closePath();
        g.fill();
    }

    const points: Array<Vector2> = [];
    for (let i = 0; i < pointAmount; i++) {
        const radius = 0.5 * size * (i / pointAmount);
        const angle = random.nextFloat(0, TWO_PI);
        const point = Vector2.fromPolar(angle, radius);

        let p1: Nullable<Vector2> = null;
        let d1: double = Number.POSITIVE_INFINITY;
        let p2: Nullable<Vector2> = null;
        let d2: double = Number.POSITIVE_INFINITY;

        if (points.length >= 2) {
            for (const p of points) {
                const d = point.distanceSquaredTo(p);
                if (p1 === null) {
                    d1 = d;
                    p1 = p;
                } else if (p2 === null) {
                    d2 = d;
                    p2 = p;
                } else if (d < d1) {
                    d1 = d;
                    p1 = p;
                } else if (d < d2) {
                    d2 = d;
                    p2 = p;
                }

                // if (d1 < d2) {
                //     const tmpP = p1 as any;
                //     p1 = p2;
                //     p2 = tmpP;
                //     const tmpD = d1;
                //     d1 = d2;
                //     d2 = tmpD;
                // }
            }

            if (p1 && p2) fillTriangle(point, p1, p2);
        }

        points.push(point);
    }

    g.restore();
}

export function drawResourceTexture2(type: ResourceType, size: double, g: CanvasRenderingContext2D) {
    g.save();
    g.translate(size / 2, size / 2);

    const halfSize = size / 2;
    const random = new PseudoRandom(stringHashCode(type.name));
    const pointAmount = random.nextInt(6, 12);

    function fillTriangle(p1: Vector2, p2: Vector2, p3: Vector2) {
        g.fillStyle = colorFrom(
            random.nextFloat(0, 1),
            random.nextFloat(0, 1),
            random.nextFloat(0, 1),
        );
        g.beginPath();
        g.moveTo(...p1.toArray());
        g.lineTo(...p2.toArray());
        g.lineTo(...p3.toArray());
        g.closePath();
        g.fill();
    }

    const points: Array<Vector2> = createArray(pointAmount, (i) => Vector2.fromPolar(
        random.nextFloat(i - 0.2, i + 0.2) * (0.3 * TWO_PI),
        random.nextFloat(i - 0.2, i + 0.2) * (halfSize / pointAmount),
    ));
    for (let i = 0; i < pointAmount; i++) {
        const point = points[i];

        let p1: Nullable<Vector2> = null;
        let d1: double = Number.POSITIVE_INFINITY;
        let p2: Nullable<Vector2> = null;
        let d2: double = Number.POSITIVE_INFINITY;

        if (points.length >= 2) {
            for (const p of points) {
                if (p === point) continue;

                const d = point.distanceSquaredTo(p);
                if (p1 === null) {
                    d1 = d;
                    p1 = p;
                } else if (p2 === null) {
                    d2 = d;
                    p2 = p;
                } else if (d < d1) {
                    d1 = d;
                    p1 = p;
                } else if (d < d2) {
                    d2 = d;
                    p2 = p;
                }
            }

            if (p1 && p2) fillTriangle(point, p1, p2);
        }
    }

    g.restore();
}

export function drawResourceTexture3(type: ResourceType, size: double, g: CanvasRenderingContext2D) {
    g.save();
    g.translate(size / 2, size / 2);

    const halfSize = size / 2;
    const standard = 0.8 * halfSize;
    const random = new PseudoRandom(stringHashCode(type.name));

    const strokeRotation = random.nextFloat(0, TWO_PI);
    const fillRotation = random.nextFloat(0, TWO_PI);

    const pointAmount = random.nextInt(3, 9);
    g.beginPath();
    for (let i = 0; i < pointAmount; i++) {
        const angle = strokeRotation + (i + random.nextFloat(-0.1, 0.1)) * (TWO_PI / pointAmount);
        g.lineTo(...Vector2.fromPolar(angle, halfSize * (1 - random.nextFloat(0, 0.618))).toArray());
    }
    g.closePath();
    g.clip();

    const gradient = g.createLinearGradient(...Vector2.fromPolar(fillRotation, standard).toArray(), ...Vector2.fromPolar(fillRotation + Math.PI, standard).toArray());
    gradient.addColorStop(0.0, randomColor(random));
    gradient.addColorStop(1.0, randomColor(random));
    g.fillStyle = gradient;
    g.fill();

    g.restore();
}

export const RESOURCE_TEXTURE_DRAWING_PRESETS = new Map<string, ResourceTextureDrawingPreset>();

export interface ResourceTextureDrawingPreset {
    originColor?: ColorData;
    sizeRange?: Pair<int, int>;
}

export function drawResourceTexture(typeName: string, size: double, g: CanvasRenderingContext2D) {
    g.save();

    const preset = RESOURCE_TEXTURE_DRAWING_PRESETS.get(typeName);

    const random = new PseudoRandom(stringHashCode(typeName));

    const originColor = preset?.originColor || randomColorData(random);

    const widthCellAmount = random.nextInt(...(preset?.sizeRange || [3, 5]));
    const heightCellAmount = random.nextInt(...(preset?.sizeRange || [3, 5]));
    const widthCellSize = size / widthCellAmount;
    const heightCellSize = size / heightCellAmount;

    const points = createArray(heightCellAmount, (cellY) => createArray(widthCellAmount, (cellX) => new Vector2(
        (cellX + random.nextFloat(0, 1)) * widthCellSize,
        (cellY + random.nextFloat(0, 1)) * heightCellSize,
    )));

    function drawTriangle(pointIndexes: Array<Pair<int, int>>) {
        const color = colorFrom(...randomOffsetColor(originColor, random));
        g.fillStyle = color;
        g.strokeStyle = color;
        g.lineWidth = 1;
        g.beginPath();
        for (const [cellX, cellY] of pointIndexes) {
            g.lineTo(...points[cellY][cellX].toArray());
        }
        g.fill();
        g.stroke();
    }

    for (let cellX = 0; cellX < widthCellAmount - 1; cellX++) {
        for (let cellY = 0; cellY < heightCellAmount - 1; cellY++) {
            const isTopLeftToButtomRight = random.nextBoolean();
            if (isTopLeftToButtomRight) {
                drawTriangle([
                    [cellX, cellY],
                    [cellX + 1, cellY],
                    [cellX, cellY + 1],
                ]);
                drawTriangle([
                    [cellX + 1, cellY + 1],
                    [cellX + 1, cellY],
                    [cellX, cellY + 1],
                ]);
            } else {
                drawTriangle([
                    [cellX, cellY],
                    [cellX + 1, cellY],
                    [cellX + 1, cellY + 1],
                ]);
                drawTriangle([
                    [cellX, cellY],
                    [cellX, cellY + 1],
                    [cellX + 1, cellY + 1],
                ]);
            }
        }
    }

    g.restore();
}

function randomColor(random: Random) {
    return colorFrom(
        0.3 + random.nextFloat(0, 0.5),
        0.3 + random.nextFloat(0, 0.5),
        0.3 + random.nextFloat(0, 0.5),
    );
}

function randomColorData(random: Random): ColorData {
    return [
        0.25 + random.nextFloat(0, 0.5),
        0.25 + random.nextFloat(0, 0.5),
        0.25 + random.nextFloat(0, 0.5),
    ];
}

function randomOffsetColor(origin: ColorData, random: Random): ColorData {
    const minorOffset = random.nextFloat(-0.2, 0.2);
    return origin.map(it => constrains(it + minorOffset + random.nextFloat(-0.05, 0.05), 0, 1)) as ColorData;
}
