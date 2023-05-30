import { Consumer } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import { TWO_PI } from "../../libs/math/Mathmatics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Random from "../../libs/math/Random";
import Vector2 from "../../libs/math/Vector2";
import Orb from "../model/Orb";

export function drawOrbBody(orb: Orb, g: CanvasRenderingContext2D) {
    const radius = g.canvas.width / 2;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(radius, radius);

    const random = new PseudoRandom(orb.uid);

    g.fillStyle = int2Color(orb.color);
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.clip();
    g.fill();
    
    const drawerIndex = random.nextInt(0, drawers.length); 
    // console.log("drawerIndex", drawerIndex);
    drawers[drawerIndex]({
        orb,
        random,
        graphics: g,
    });

    const lightSize = orb.radius * 1;
    const lightDirection = orb.position.normalized.mul(lightSize);

    const gradientLight = g.createRadialGradient(0, 0, (orb.radius - lightSize), ...lightDirection.toArray(), orb.radius + lightSize);
    gradientLight.addColorStop(0.0, "transparent");
    gradientLight.addColorStop(1.0, "white");
    g.fillStyle = gradientLight;
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.fill();

    const gradientDark = g.createRadialGradient(0, 0, (orb.radius - lightSize), ...lightDirection.mul(-1).toArray(), orb.radius + lightSize);
    gradientDark.addColorStop(0.0, "transparent");
    gradientDark.addColorStop(1.0, "black");
    g.fillStyle = gradientDark;
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.fill();

    g.restore();
}

export interface DrawingContext {
    orb: Orb;
    random: Random;
    graphics: CanvasRenderingContext2D;
}

export const drawers: Array<Consumer<DrawingContext>> = [
    drawSpiral,
    drawStar,
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

    const gradient = graphics.createRadialGradient(0, 0, 0.618 * orb.radius, 0, 0, orb.radius + 1);
    gradient.addColorStop(0.0, "transparent");
    gradient.addColorStop(1.0, "black");
    graphics.fillStyle = gradient;
    graphics.beginPath();
    graphics.arc(0, 0, orb.radius + 1, 0, TWO_PI);
    graphics.fill();
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

export function drawWave(context: DrawingContext) {
    const { random, graphics } = context;
    
}

export function drawCrosslink(context: DrawingContext) {
    const { random, graphics } = context;
    
}