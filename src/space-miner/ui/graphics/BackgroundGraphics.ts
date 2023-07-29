import { Pair } from "../../../libs/CommonTypes";
import { rand, randInt, TWO_PI } from "../../../libs/math/Mathmatics";

export function drawBackground(g: CanvasRenderingContext2D) {
    const canvas = g.canvas;
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    canvas.width = width;
    canvas.height = height;
    
    g.fillStyle = "#0A000F";
    g.fillRect(0, 0, width, height);
    
    const amount = randInt(3000, 5000);
    g.fillStyle = "#ffffff40";
    g.shadowColor = "#ffffff40";
    g.shadowBlur = 2;
    for (let i = 0; i < amount; i++) {
        const position = [rand(0, width), rand(0, height)] as Pair<number, number>;
        const radius = rand(0.5, 2);
        g.beginPath()
        g.arc(...position, radius, 0, TWO_PI);
        g.fill();
    }
}