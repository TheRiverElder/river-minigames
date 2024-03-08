import { Consumer, int } from "../CommonTypes";

export function repeatString(str: string, amount: int): string {
    return Array(amount).fill(str).join("");
}

export function repeatRun(fn: Consumer<int>, amount: int) {
    for (let i = 0; i < amount; i++) {
        fn(i);
    }
}

export function readableNumber(num: number): string {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2);
}

export function capitalize(str: string): string {
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.slice(1);
}

export function shortenAsHumanReadable(num: number, precision: int = 1, mininum: number = 1): string {
    if (!Number.isFinite(num)) return num > 0 ? "+∞" : "-∞";
    if (Number.isNaN(num)) return "NaN";
    if (num === 0) return "0";
    if (num < mininum) return "<" + mininum;
    const sign = Math.sign(num);
    const n = Math.abs(num);
    const power = Math.floor(Math.log10(n));
    const unitPower = Math.floor(power / 3) * 3;
    if (unitPower === 0 && Number.isInteger(n)) return n.toString();
    const common = (n / Math.pow(10, unitPower)).toFixed(precision);
    return (sign < 0 ? "-" : "") + (unitPower === 0 ? common : `${common}e${unitPower}`);
}

export function toPercentString(num: number, precision: int = 0): string {
    return (num * 100).toFixed(precision) + "%";
}