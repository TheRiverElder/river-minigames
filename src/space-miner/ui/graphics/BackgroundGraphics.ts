import { double, int, Pair } from "../../../libs/CommonTypes";
import { repeatRun } from "../../../libs/lang/Extensions";
import { rand, randInt, TWO_PI } from "../../../libs/math/Mathmatics";
import Vector2 from "../../../libs/math/Vector2";

type VectorArray2D = Pair<number, number>;

export function drawBackground(g: CanvasRenderingContext2D) {
    const canvas = g.canvas;
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    canvas.width = width;
    canvas.height = height;
    
    g.fillStyle = "#0A000F";
    g.fillRect(0, 0, width, height);

    function drawStar(position: VectorArray2D, radius: double) {
        g.beginPath()
        g.arc(...position, radius, 0, TWO_PI);
        g.fill();
    }

    function drawStars(center: VectorArray2D, range: double, amount: int, starRadius: double) {
        for (let i = 0; i < amount; i++) {
            const angle = rand(0, TWO_PI);
            const modulo = rand(0, range);
            const position = [
                center[0] + modulo * Math.cos(angle), 
                center[1] + modulo * Math.sin(angle),
            ] as VectorArray2D;
            drawStar(position, starRadius);
        }
    }

    const sampleSize = 0.3 * Math.min(width, height);
    
    g.fillStyle = "#ffffff80";
    g.shadowColor = "#ffffff40";
    g.shadowBlur = 2;

    function isInside(point: VectorArray2D, tolerance: double): boolean {
        return (point[0] >= -tolerance && point[0] < width + tolerance) && (point[1] >= -tolerance && point[1] < height + tolerance);
    }

    const step = 20;
    const amountPerStep = 100;


    function runUntilOutboard(anchor: VectorArray2D, direction: VectorArray2D, range: double, starRadius: double) {
        const point = [anchor[0], anchor[1]] as VectorArray2D;
        while(isInside(point, range)) {
            drawStars(point, range, amountPerStep, starRadius);

            point[0] += direction[0];
            point[1] += direction[1];
        }
    }

    function drawRandomLine(level: double) {
        const range = sampleSize;
        const starRadius: double = 0.2 + 0.5 / (0.2 * level + 1);
        const lineAnchor: VectorArray2D = [width * (0.25 + rand(0, 0.5)), height * (0.25 + rand(0, 0.5))];
        const lineDirection: VectorArray2D = Vector2.fromPolar(rand(0, TWO_PI), step).toArray();
    
        runUntilOutboard(lineAnchor, lineDirection, range, starRadius);
        drawStars(lineAnchor, range, amountPerStep, starRadius);
        runUntilOutboard(lineAnchor, lineDirection.map(it => -it) as VectorArray2D, range, starRadius);
    }

    // 正式开始画
    // 底噪
    repeatRun(() => {
        drawStar([width * rand(0, 1), height * rand(0, 1)], 0.5);
    }, 5000);
    // 各种星系
    repeatRun((i) => {
        drawRandomLine(i);
    }, 2);
}