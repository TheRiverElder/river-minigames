import { double, int } from "../CommonTypes";
import { constrains } from "../math/Mathmatics";

export type ColorData = [double, double, double];

export function colorDataFromInt(num: int): ColorData {
    return [
        ((num >>> 16) & 0xff) / 0xff,
        ((num >>> 8) & 0xff) / 0xff,
        (num & 0xff) / 0xff,
    ];
}

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

export function int2Color(color: int): string {
    const value = Math.floor(color);
    return '#' + [
        (value >>> 16) & 0xff,
        (value >>> 8) & 0xff,
        value & 0xff,
    ].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * 
 * @param red ∈[0, 1]
 * @param green ∈[0, 1]
 * @param blue ∈[0, 1]
 * @returns 
 */
export function colorFrom(red: double, green: double, blue: double): string {
    return "#" + [red, green, blue].map((v) => Math.round(constrains(v, 0, 1) * 0xff)).map(v => v.toString(16).padStart(2, '0')).join('');
}