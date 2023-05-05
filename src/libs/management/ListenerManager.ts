import { Consumer, int } from "../CommonTypes";

export default class ListenerManager<TEvent = void> {
    private listeners = new Set<Consumer<TEvent>>();

    get size(): int {
        return this.listeners.size;
    }

    add(listener: Consumer<TEvent>) {
        this.listeners.add(listener);
    }

    remove(listener: Consumer<TEvent>) {
        this.listeners.delete(listener);
    }

    clear() {
        this.listeners.clear();
    }

    emit(event: TEvent) {
        this.listeners.forEach(l => l(event));
    }

}