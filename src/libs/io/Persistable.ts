export default interface Persistable<TContext> {
    onSerialize(context: TContext): any;
    onDeserialize(data: any, context: TContext): void;
}