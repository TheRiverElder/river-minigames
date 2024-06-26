import { Consumer } from "../CommonTypes";
import { NOP } from "./Constants";
import { isEmpty, requireNonNull } from "./Objects";

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

    public static ofNull<T>(): Optional<T> {
        return new Optional<T>(null as T);
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

    public ifPresent(callback: Consumer<T>, elseCallback: Function = NOP): Optional<T> {
        if (this.present()) {
            callback(this.value as T);
        } else {
            elseCallback();
        }
        return this;
    }

    public ifEmpty(callback: Consumer<T>, elseCallback: Function = NOP): Optional<T> {
        if (this.empty()) {
            callback(this.value as T);
        } else {
            elseCallback();
        }
        return this;
    }

    public get(): Exclude<T, null | undefined> {
        requireNonNull(this.value);
        return this.value as any;
    }

    public orNull(): Nullable<T> {
        return this.empty() ? null : (this.value as T);
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

    // Only run if present
    public map<R>(mapper: (v: T) => R): Optional<R> {
        if (Optional.isNull(this.value)) return Optional.ofNull();
        return Optional.of(mapper(this.value as T));
    }
}