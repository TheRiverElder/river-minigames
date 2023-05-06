import ListenerManager from "./ListenerManager";
import Registry from "./Registry";

export default class ObservableRegistry<K, V> extends Registry<K, V> {

    readonly onAdd = new ListenerManager<V>();
    readonly onRemove = new ListenerManager<V>();
    
    add(value: V): boolean {
        const result = super.add(value);
        this.onAdd.emit(value);
        return result;
    }

    remove(value: V): boolean {
        const result = super.remove(value);
        this.onRemove.emit(value);
        return result;
    }

    removeByKey(key: K): boolean {
        if (!this.map.has(key)) return false;
        const value: V = this.map.get(key) as V;
        this.map.delete(key);
        this.onRemove.emit(value);
        return true;
    }
}