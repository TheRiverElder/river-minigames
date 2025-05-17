import { clamp } from "lodash";

// 适用于原本值无上限或下限的情况
// 当x为halfValue时，返回0.5
export function createAtanNormalizer(halfValue: number = 1) {
    return (n: number) => clamp(Math.atan(n / halfValue) / (Math.PI / 2), 0, 1);
}

// 适用于原本值有上下限的情况
export function createLinearNormalizer(k: number = 1) {
    return (n: number) => clamp(k * n, 0, 1);
}