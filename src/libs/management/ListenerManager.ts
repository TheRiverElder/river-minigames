import { Consumer, Productor } from "../CommonTypes";

export default class ListenerManager<TEvent = void, TResult = void> {
    private listeners = new Set<Consumer<TEvent>>();

    add(listener: Productor<TEvent, TResult>): () => void {
        this.listeners.add(listener);
        return () => this.remove(listener);
    }

    remove(listener: Productor<TEvent, TResult>) {
        this.listeners.delete(listener);
    }

    emit(event: TEvent): TResult {
        let result;
        for (const listener of this.listeners) {
            result = listener(event);
        }
        return result as any;
    }

    pipe(next: ListenerManager<TEvent, TResult>): () => void {
        const listener = (event: TEvent) => next.emit(event);
        return this.add(listener);
    }

}