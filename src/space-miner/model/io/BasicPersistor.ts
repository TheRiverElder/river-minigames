import Persistor from "../../../libs/io/Persistor";
import BasicType from "../../../libs/management/BasicType";
import Registry from "../../../libs/management/Registry";
import Game from "../../Game";
import BasicPersistable from "./BasicPersistable";
import { CreativeType } from "./CreativeType";

export default class BasicPersistor<TOrigin extends BasicPersistable<TOrigin>> implements Persistor<TOrigin, Game> {

    public readonly registry = new Registry<string, CreativeType<TOrigin>>(BasicType.KEY_MAPPER);

    serialize(origin: TOrigin, context: Game) {
        return {
            type: origin.type.id,
            data: origin.onSerialize(context),
        };
    }
    
    deserialize(data: any, context: Game): TOrigin {
        const typeId = data.type;
        const contentData = data.data;
        const type = this.registry.getOrThrow(typeId);
        const origin = type.create(context, contentData);
        origin.onDeserialize(contentData, context);
        return origin;
    }

}