export type int = number;
export type double = number;

export interface Unique {
    get uid(): int;
}

export type Supplier<R> = () => R;
export type Consumer<T> = (input: T) => void;
export type Productor<T, R> = (input: T) => R;
export type Predicator<T> = (input: T) => boolean;