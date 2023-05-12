import { double, int } from "../libs/CommonTypes";
import Vector2 from "../libs/math/Vector2";
import Bion from "./model/Bion";
import MessagePack, { MessagePackType } from "./MessagePack";
import PartSlot from "./PartSlot";

export default class Wave {
    public readonly environment: Bion;
    public readonly position: Vector2;
    public readonly type: MessagePackType;
    public amount: double;
    public distance: int;

    constructor(environment: Bion, position: Vector2, type: MessagePackType, amount: double, distance: int = 0) {
        this.environment = environment;
        this.position = position;
        this.type = type;
        this.amount = amount;
        this.distance = distance;
    }

    public consume(amount: double) {
        this.amount = Math.max(0, this.amount - amount);
    }

    public exist(): boolean {
        const { width, height } = this.environment.board;
        return [
            new Vector2(0, 0),
            new Vector2(width, 0),
            new Vector2(0, height),
            new Vector2(width, height),
        ].some(corner => this.position.manhattanDistanceTo(corner) <= this.distance);
    }

    // 不影响position本身
    public apply() {
        const receivers: Array<PartSlot> = [];
        for (let x = 0; x < this.distance; x++) {
            const pos = this.position.add(new Vector2(x, x - this.distance));
            const receiver = this.environment.board.getOrNull(...pos.toArray());
            if (!receiver) continue;
            receivers.push(receiver);
        }

        const distributed = this.amount / (4 * this.distance);

        receivers.forEach(r => r.part?.receive(new MessagePack(this.type, distributed)));

        this.distance++;
    }

}