export function square(x: number): number {
    return x * x;
}

// result in (minimum, maximum]
export function rand(minimum: number, maximum: number): number {
    return (Math.random() * (maximum - minimum) + minimum);
}

// result in (minimum, maximum]
export function randInt(minimum: number, maximum: number): number {
    return Math.floor(rand(minimum, maximum));
}

export function checkLessThan(valve: number): boolean {
    return (Math.random() < valve);
}

export function randOne<T>(array: Array<T>): T {
    if (array.length === 0) throw new Error("Cannot get random from an empty array!");
    return array[randInt(0, array.length)];
}

export function randOneOrNull<T>(array: Array<T>): T | null {
    if (array.length === 0) return null;
    return array[randInt(0, array.length)];
}

export function constrains(value: number, minimum: number, maximum: number): number {
    return (value <= minimum) ? minimum : (value >= maximum ? maximum : value);
}

export function interpolate(startValue: number, endValue: number, ratio: number): number {
    return startValue + (endValue - startValue) * ratio;
}