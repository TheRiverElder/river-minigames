import { Consumer } from "../CommonTypes";
import { Nullable } from "./Optional";

export function requireNonNull<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) throw new Error("Null occoured!");
    return value;
}

export function isEmpty<T>(value: T | null | undefined): boolean {
    return (value === null || value === undefined);
}

export function withNullable<T>(obj: T, fn: Consumer<T>): T {
    fn(obj);
    return obj;
}

export function withNotnull<T>(obj: T, fn: Consumer<T>): T {
    fn(obj);
    return obj;
}