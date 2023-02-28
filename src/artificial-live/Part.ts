import type { int, Unique } from "../libs/CommonTypes";
import Vector2 from "../libs/math/Vector2";
import type Bion from "./Bion";
import MessagePack from "./MessagePack";
import Program from "./program/Program";
import PropertyManager from "./PropertyManager";

export default abstract class Part implements Unique {
    public readonly uid: int;
    public readonly bion: Bion;
    public readonly position: Vector2;
    public readonly program: Program = new Program();
    public readonly properties: PropertyManager = new PropertyManager();

    constructor(bion: Bion, position: Vector2 = Vector2.INVALID_VECTOR2) {
        this.bion = bion;
        this.position = position;
        this.uid = bion.uidGenerator.generate();
    }

    abstract receive(pack: MessagePack): void;

    abstract render(g: CanvasRenderingContext2D): void;

    abstract tick(): void;
}