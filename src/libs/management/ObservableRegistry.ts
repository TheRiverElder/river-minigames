import { Nullable } from "../lang/Optional";
import ListenerManager from "./ListenerManager";
import Registry from "./Registry";

export default class ObservableRegistry<K, V> extends Registry<K, V> {

    readonly onAddListeners = new ListenerManager<V>();
    readonly onRemoveListeners = new ListenerManager<V>();
    
    add(value: V): boolean {
        const result = super.add(value);
        this.onAddListeners.emit(value);
        return result;
    }
    removeByKey(key: K): Nullable<V> {
        const result = super.removeByKey(key);
        if (result) this.onRemoveListeners.emit(result);
        return result;
    }
}