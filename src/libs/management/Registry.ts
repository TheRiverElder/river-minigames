import { Productor } from "../CommonTypes";
import { isEmpty } from "../lang/Objects";
import Optional from "../lang/Optional";

const DEFAULT_ERROR_THROWER: Productor<any, Error> = (key) => Error("Cannot find key: " + key)

export default class Registry<K, V> {

    private keyGetter: Productor<V, K>;
    private map = new Map<K, V>();

    constructor(keyGetter: Productor<V, K>) {
        this.keyGetter = keyGetter;
    }

    add(...values: Array<V>) {
        values.forEach(value => this.map.set(this.keyGetter(value), value));
    }

    remove(...values: Array<V>) {
        values.forEach(value => this.map.delete(this.keyGetter(value)));
    }

    removeByKey(...keys: Array<K>) {
        keys.forEach(key => this.map.delete(key));
    }

    getOrThrow(key: K, errorThrower: Productor<K, Error> = DEFAULT_ERROR_THROWER): V {
        const value = this.map.get(key);
        if (isEmpty(value)) throw errorThrower(key);
        return value as V;
    }

    get(key: K): Optional<V> {
        return Optional.ofNullable(this.map.get(key) || null);
    }

    keys() {
        return Array.from(this.map.keys());
    }

    values() {
        return Array.from(this.map.values());
    }

    entries() {
        return Array.from(this.map.entries());
    }

    size() {
        return this.map.size;
    }

}