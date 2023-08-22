import { Consumer, double } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import { createArray } from "../../libs/lang/Collections";
import { randOne, TWO_PI } from "../../libs/math/Mathmatics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Random from "../../libs/math/Random";
import Vector2 from "../../libs/math/Vector2";
import Orb from "../model/orb/Orb";
import StellarOrb from "../model/orb/StellarOrb";
import TerraLikeOrb from "../model/orb/TerraLikeOrb";

export function drawOrbBody(orb: Orb, g: CanvasRenderingContext2D) {
    const radius = orb.radius;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(g.canvas.width / 2, g.canvas.height / 2);
    
    const minRadius = Math.min(g.canvas.width, g.canvas.height) / 2;
    if (radius > minRadius) g.scale(minRadius / radius, minRadius / radius);


    g.save();

    if (orb instanceof TerraLikeOrb) drawTerraLikeOrb(orb, g);
    else if (orb instanceof StellarOrb) drawStellarOrb(orb, g);

    g.restore();
}

export function drawTerraLikeOrb(orb: TerraLikeOrb, g: CanvasRenderingContext2D) {
    const random = new PseudoRandom(orb.uid);

    // 绘制底色
    g.fillStyle = int2Color(orb.color);
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.clip();
    g.fill();
    
    // 绘制图案
    randOne(drawers, random)({
        orb,
        random,
        graphics: g,
    });
}

export function drawStellarOrb(orb: StellarOrb, g: CanvasRenderingContext2D) {
    // 绘制底色
    g.fillStyle = int2Color(orb.color);
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.clip();
    g.fill();
}

// 绘制一个光影遮罩，光面在正右
export function drawLightAndShadow(radius: double, g: CanvasRenderingContext2D) {
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

export interface DrawingContext {
    orb: Orb;
    random: Random;
    graphics: CanvasRenderingContext2D;
}

export const drawers: Array<Consumer<DrawingContext>> = [
    drawSpiral,
    drawStar,
    drawString,
];

export function drawSpiral(context: DrawingContext) {
    const { orb, random, graphics } = context;
    const startAngle = random.nextFloat(0, TWO_PI);
    const speed = random.nextFloat(5, 20); // 该螺旋转一周所提升的高度

    // console.log("startAngle", startAngle);
    // console.log("speed", speed);

    // 采用错圆法

    graphics.strokeStyle = "#ffffff80";
    graphics.lineWidth = 3;
    graphics.beginPath();
    for (let layer = 0; layer * speed < orb.radius; layer++) {
        graphics.arc(0, 0, layer * speed, startAngle, startAngle + Math.PI);
        graphics.arc(0.5 * speed, 0, (layer + 0.5) * speed, startAngle + Math.PI, startAngle + TWO_PI);
    }
    graphics.stroke();
}

export function drawStar(context: DrawingContext) {
    const { orb, random, graphics } = context;

    graphics.strokeStyle = "#ffffff80";
    graphics.lineWidth = 3;
    graphics.beginPath();
    const cornerAmount = random.nextInt(4, 10);
    for (let i = 0; i < cornerAmount; i++) {
        const theta = random.nextFloat(0, TWO_PI);
        const rho = random.nextFloat(0.2, 0.9) * orb.radius;
        const offset = Vector2.fromPolar(theta, rho);
        graphics.lineTo(...offset.toArray());
    }
    graphics.closePath();
    graphics.stroke();
    
}

export function drawString(context: DrawingContext) {
    const { orb, random, graphics } = context;
    console.log("drawString", orb.name);

    graphics.strokeStyle = "#ffffff80";
    graphics.lineWidth = 3;
    graphics.beginPath();
    const pointAmount = random.nextInt(4, 10);
    const points = createArray(pointAmount, () => Vector2.fromPolar(random.nextFloat(0, TWO_PI), random.nextFloat(0.2, 0.9) * orb.radius));
    const amplifier = 0.618 * orb.radius;
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
    const { random, graphics } = context;
    
}

export function drawCrosslink(context: DrawingContext) {
    const { random, graphics } = context;
    
}