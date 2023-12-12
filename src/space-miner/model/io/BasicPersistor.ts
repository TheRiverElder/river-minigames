import { Supplier } from "../../../libs/CommonTypes";
import Persistable from "../../../libs/io/Persistable";
import Persistor from "../../../libs/io/Persistor";
import Game from "../../Game";

export default class BasicPersistor<TOrigin extends Persistable<Game>> implements Persistor<TOrigin, Game> {

    public readonly id: string;
    private readonly creator: Supplier<TOrigin>;

    constructor(id: string, creator: Supplier<TOrigin>) {
        this.id = id;
        this.creator = creator;
    }

    serialize(origin: TOrigin, context: Game) {
        throw new Error("Method not implemented.");
    }
    
    deserialize(data: any, context: Game): TOrigin {
        const origin = this.creator();
        origin.onDeserialize(data, context);
    }

}