export function requireNonNull<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) throw new Error("Null occoured!");
    return value;
}