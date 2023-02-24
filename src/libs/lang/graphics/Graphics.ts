export function drawChamferRect(g: CanvasRenderingContext2D, edgeLength: number, chamferLength: number) {
    g.beginPath();
    g.moveTo(0, chamferLength);
    g.lineTo(0, edgeLength - chamferLength);
    g.lineTo(chamferLength, edgeLength);
    g.lineTo(edgeLength - chamferLength, edgeLength);
    g.lineTo(edgeLength, edgeLength - chamferLength);
    g.lineTo(edgeLength, chamferLength);
    g.lineTo(edgeLength - chamferLength, 0);
    g.lineTo(chamferLength, 0);
    g.closePath();
}