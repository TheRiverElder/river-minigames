import type { int, Unique } from "../libs/CommonTypes";
import Array2D from "../libs/lang/Array2D";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import type Bion from "./Bion";
import MessagePack from "./MessagePack";
import PropertyManager from "./PropertyManager";

export default class Part implements Unique {
    public readonly uid: int;
    public readonly bion: Bion;
    public readonly position: Vector2;
    public readonly properties: PropertyManager = new PropertyManager();
    public readonly memory: Array2D<Nullable<Array<any>>>;

    constructor(bion: Bion, position: Vector2 = Vector2.INVALID_VECTOR2) {
        this.bion = bion;
        this.position = position;
        this.uid = bion.uidGenerator.generate();
        this.memory = this.bion.program.board.map(() => null);
    }

    receive(pack: MessagePack): void {

    }

    render(g: CanvasRenderingContext2D): void {

    }

    tick(): void {

    }
}