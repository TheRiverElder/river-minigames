import { Consumer } from "../CommonTypes";

export default class ListenerManager<TEvent = void> {
    private listeners = new Set<Consumer<TEvent>>();

    add(listener: Consumer<TEvent>): () => void {
        this.listeners.add(listener);
        return () => this.remove(listener);
    }

    remove(listener: Consumer<TEvent>) {
        this.listeners.delete(listener);
    }

    emit(event: TEvent) {
        this.listeners.forEach(l => l(event));
    }

    pipe(next: ListenerManager<TEvent>): () => void {
        const listener = (event: TEvent) => next.emit(event);
        return this.add(listener);
    }

}