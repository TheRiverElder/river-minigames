import { double } from "../../../libs/CommonTypes";

let flagLayer: double = 1;
let flag: double = 1;

export function generateColor(): string {
    const divisor = Math.pow(2, flagLayer);
    const step = 0x01000000 / divisor;
    const value = step * flag;
    const red = (value >>> 16) & 0xff;
    const green = (value >>> 8) & 0xff;
    const blue = (value) & 0xff;

    if (flag >= divisor) {
        flagLayer++;
        flag = 1;
    }

    return `rbg(${red}, ${green}, ${blue})`;
}