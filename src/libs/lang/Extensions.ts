import { int } from "../CommonTypes";

export function repeatString(str: string, amount: int): string {
    return Array(amount).fill(str).join("");
}

export function repeatRun(fn: Function, amount: int) {
    for (let i = 0; i < amount; i++) {
        fn();
    }
}