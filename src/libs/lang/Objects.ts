export function requireNonNull<T>(value: T | null): T {
    if (value === null) throw new Error("Null occoured!");
    return value;
}