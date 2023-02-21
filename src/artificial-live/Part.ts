import type { double, int, Unique } from "../libs/CommonTypes";
import type Bion from "./Bion";
import MessagePack from "./MessagePack";
import PropertyManager from "./PropertyManager";

export default abstract class Part implements Unique {
    public readonly uid: int;
    public readonly bion: Bion;
    public readonly properties: PropertyManager = new PropertyManager();

    constructor(bion: Bion) {
        this.bion = bion;
        this.uid = bion.uidGenerator.generate();
    }

    abstract receive(pack: MessagePack): void;
}