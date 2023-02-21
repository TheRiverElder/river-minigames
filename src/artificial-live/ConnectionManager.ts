import { computeIfAbsent } from "../libs/lang/Collections";
import Optional from "../libs/lang/Optional";
import Connection from "./Connection";

export default class ConnectionManager<T> {

    private readonly sourceMap = new Map<T, Map<T, Connection<T>>>();
    private readonly targetMap = new Map<T, Map<T, Connection<T>>>();

    constructor() {
        
    }

    public getBySource(source: T): Array<Connection<T>> {
        return Array.from(this.sourceMap.get(source)?.values() || []);
    }

    public getBytarget(target: T): Array<Connection<T>> {
        return Array.from(this.targetMap.get(target)?.values() || []);
    }

    public get(source: T, target: T): Connection<T> | null {
        return this.sourceMap.get(source)?.get(target) || null;
    }

    public add(connection: Connection<T>) {
        computeIfAbsent(this.sourceMap, connection.source, () => new Map<T, Connection<T>>()).set(connection.target, connection);
        computeIfAbsent(this.targetMap, connection.target, () => new Map<T, Connection<T>>()).set(connection.source, connection);
    }

    public remove(connection: Connection<T>) {
        const { source, target } = connection;
        Optional.ofNullable(this.sourceMap.get(source)).ifPresent(it => it.delete(target));
        Optional.ofNullable(this.targetMap.get(target)).ifPresent(it => it.delete(source));
    }
}