import Persistable from "../../../libs/io/Persistable";
import Game from "../global/Game";
import { CreativeType } from "./CreativeType";

export default interface BasicPersistable<T> extends Persistable<Game> {
    get type(): CreativeType<T>;
}