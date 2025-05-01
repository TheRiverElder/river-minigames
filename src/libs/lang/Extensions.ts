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

export interface ReadableNumberOptions {
    precision?: int; // 科学计数法时，小数点后的位数
    minimum?: number; // 最下限，低于这个值将显示为 "< minimum"
    section?: int; // 每多少位分一段，默认3
}

export function shortenAsHumanReadable(num: number, options: ReadableNumberOptions = {}): string {
    if (!Number.isFinite(num)) return num > 0 ? "+∞" : "-∞";
    if (Number.isNaN(num)) return "NaN";
    
    const { precision = 1, minimum = 1, section = 3 } = options;

    if (num === 0) return num.toFixed(precision);

    const n = Math.abs(num);
    if (n < minimum) return "<" + minimum;
    
    const sign = Math.sign(num);
    const power = Math.floor(Math.log10(n));
    const unitPower = Math.floor(power / section) * section; // 科学计数法中将以这个指数为单位
    if (unitPower === 0 && Number.isInteger(n)) return n.toFixed(precision);

    if (unitPower < 0 && power > unitPower)return (sign < 0 ? "-" : "") + n.toFixed(section);

    const common = (n / Math.pow(10, unitPower)).toFixed(precision);
    return (sign < 0 ? "-" : "") + (unitPower === 0 ? common : `${common}e${unitPower}`);
}

export function toPercentString(num: number, precision: int = 0): string {
    return (num * 100).toFixed(precision) + "%";
}