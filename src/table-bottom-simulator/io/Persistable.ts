export default interface Persistable<TData = any> {
    restore(data: TData): void;
}