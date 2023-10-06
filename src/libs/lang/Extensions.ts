import { int } from "../CommonTypes";

export function repeatString(str: string, amount: int): string {
    return Array(amount).fill(str).join("");
}

export function repeatRun(fn: Function, amount: int) {
    for (let i = 0; i < amount; i++) {
        fn();
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

export function shortenAsHumanReadable(num: number): string {
    if (!Number.isFinite(num)) return num > 0 ? "+∞" : "-∞";
    if (Number.isNaN(num)) return "NaN";
    if (num === 0) return "0";
    const sign = Math.sign(num);
    const n = Math.abs(num);
    const power = Math.floor(Math.log10(n));
    const unitPower = Math.floor(power / 3) * 3;
    if (unitPower === 0 && Number.isInteger(n)) return n.toString();
    const common = (n / Math.pow(10, unitPower)).toFixed(1);
    return (sign < 0 ? "-" : "") + (unitPower === 0 ? common : `${common}e${unitPower}`);
}