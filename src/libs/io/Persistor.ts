

export default interface Persistor<TOrigin, TContect> {
    serialize(origin: TOrigin, context: TContect): any;
    deserialize(data: any, context: TContect): TOrigin;
}