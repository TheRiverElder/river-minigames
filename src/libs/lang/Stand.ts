export default class Stand<T> {

    public value: T | null = null;

    public get(): T {
        if (this.value === null) throw new Error("Cannot get");
        return this.value;
    }
}