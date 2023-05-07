import type { double, int, Unique } from "../libs/CommonTypes";
import Array2D from "../libs/lang/Array2D";
import { Nullable } from "../libs/lang/Optional";
import { constrains } from "../libs/math/Mathmatics";
import { PROPERTY_TYPE_ANTIGEN, PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_SIZE, PROPERTY_TYPE_WATER } from "./instances/neublumen/NeublumenPropertyTypes";
import MessagePack from "./MessagePack";
import PartSlot from "./PartSlot";
import PropertyManager, { PropertyType } from "./PropertyManager";
import { consumeByMinimumRate } from "./util/Utils";

export default class Part implements Unique {
    public readonly uid: int;
    public readonly properties: PropertyManager = new PropertyManager();
    public memory: Array2D<Nullable<Array<any>>>;
    public slot: Nullable<PartSlot> = null;

    constructor(uid: int) {
        this.uid = uid;
        this.memory = new Array2D(0, 0, () => null);
    }

    receive(pack: MessagePack): void {

    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "black";
        g.beginPath();
        g.arc(0.5, 0.5, constrains(this.properties.get(PROPERTY_TYPE_SIZE), 0.0, 1.0) / 2, 0, 2 * Math.PI);
        g.fill();
    }

    tick(): void {
        // TEST
        this.drain(PROPERTY_TYPE_WATER, 0.2);
        this.drain(PROPERTY_TYPE_NUTRITION, 0.2);
        this.grow(0.1);
    }

    // 从环境汲取养料
    drain(type: PropertyType, strength: double): double {
        const amount = this.slot?.drain(type, strength) || 0.0;
        this.properties.mutate(type, +amount);
        return amount;
    }

    // 检测内部物质量
    senseInner(type: PropertyType): double {
        return this.properties.get(type) || 0.0;
    }

    // 检测外部物质量
    senseOuter(type: PropertyType): double {
        return this.slot?.properties.get(type) || 0.0;
    }

    // 生长
    grow(amount: double) {
        const rate = consumeByMinimumRate(this.properties, [
            [PROPERTY_TYPE_WATER, 2.0 * amount],
            [PROPERTY_TYPE_NUTRITION, 1.0 * amount],
        ]);
        this.properties.mutate(PROPERTY_TYPE_SIZE, +rate * amount);
        return rate * amount;
    }
}