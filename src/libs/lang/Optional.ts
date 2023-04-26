export type Nullable<T> = T | null;
export type Emptyable<T> = T | null | undefined;

export default class Optional<T> {

    public static isNull<T>(value: Nullable<T>): boolean {
        return (value === null || value === undefined);
    }

    public static of<T>(value: T): Optional<T> {
        if (Optional.isNull(value)) throw new Error("Cannot Optional.of(null)");
        return new Optional(value);
    }

    public static ofNullable<T>(value: Nullable<T>): Optional<T> {
        return new Optional<T>(value as T);
    }

    private value: Nullable<T>;

    private constructor(value: T) {
        this.value = value;
    }

    public empty(): boolean {
        return Optional.isNull(this.value);
    }

    public present(): boolean {
        return !Optional.isNull(this.value);
    }

    public ifPresent(callback: (value: T) => void) {
        if (this.present()) {
            callback(this.value as T);
        }
    }

    public get(): Nullable<T> {
        return this.value;
    }

    public orElse(alter: T): T {
        return this.empty() ? alter : (this.value as T);
    }

    public orElseGet(getAlter: () => T): T {
        return this.empty() ? getAlter() : (this.value as T);
    }

    public orElseThrow(error: Error): T {
        if (this.empty()) throw error;
        return this.value as T;
    }

    public orElseThrows(getError: () => Error): T {
        if (this.empty()) throw getError();
        return this.value as T;
    }
}