export default class Connection<T> {
    readonly source: T;
    readonly target: T;

    constructor(source: T, target: T) {
        this.source = source;
        this.target = target;
    }
}