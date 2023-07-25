import { Consumer, double } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import { TWO_PI } from "../../libs/math/Mathmatics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Random from "../../libs/math/Random";
import Vector2 from "../../libs/math/Vector2";
import Orb from "../model/orb/Orb";

export function drawOrbBody(orb: Orb, g: CanvasRenderingContext2D) {
    const radius = orb.radius;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(g.canvas.width / 2, g.canvas.height / 2);
    {
        const minRadius = Math.min(g.canvas.width, g.canvas.height) / 2;
        if (radius > minRadius) g.scale(minRadius / radius, minRadius / radius);
    }

    const random = new PseudoRandom(orb.uid);

    g.save();
    g.rotate(orb.rotation);

    // 绘制底色

    g.fillStyle = int2Color(orb.color);
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.clip();
    g.fill();
    
    // 绘制图案
    
    const drawerIndex = random.nextInt(0, drawers.length); 
    // console.log("drawerIndex", drawerIndex);
    drawers[drawerIndex]({
        orb,
        random,
        graphics: g,
    });

    g.restore();
}

// 绘制一个光影遮罩，光面在正右
export function drawlightAndShadow(radius: double, g: CanvasRenderingContext2D) {
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