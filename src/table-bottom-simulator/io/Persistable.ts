export default interface Persistable<TData = any> {
    save(): TData;
    restore(data: TData): void;
}