import type { int, Unique } from "../libs/CommonTypes";
import type Bion from "./Bion";
import MessagePack from "./MessagePack";
import PropertyManager from "./PropertyManager";

export default abstract class Part implements Unique {
    public readonly uid: int;
    public readonly bion: Bion;
    // public readonly program: Program = new Program();
    public readonly properties: PropertyManager = new PropertyManager();

    constructor(bion: Bion) {
        this.bion = bion;
        this.uid = bion.uidGenerator.generate();
    }

    abstract receive(pack: MessagePack): void;

    abstract render(g: CanvasRenderingContext2D): void;
}