import type { double, int, Unique } from "../libs/CommonTypes";
import Array2D from "../libs/lang/Array2D";
import { sumBy } from "../libs/lang/Collections";
import { Nullable } from "../libs/lang/Optional";
import { constrains } from "../libs/math/Mathmatics";
import { randomElement } from "../libs/math/RandomNumber";
import { PROPERTY_TYPE_ANTIBODY, PROPERTY_TYPE_ANTIGEN, PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_SIZE, PROPERTY_TYPE_WATER } from "./instances/neublumen/NeublumenPropertyTypes";
import LocatedEnv from "./LocatedEnv";
import MessagePack from "./MessagePack";
import PartSlot from "./PartSlot";
import PropertyManager, { PropertyType } from "./PropertyManager";
import { consumeByMinimumRate } from "./util/Utils";

export default class Part implements Unique {
    public readonly uid: int;
    public readonly properties: PropertyManager = new PropertyManager();
    public memory: Array2D<Nullable<Array<any>>>;
    // public slot: Nullable<PartSlot> = null;

    constructor(uid: int) {
        this.uid = uid;
        this.memory = new Array2D(0, 0, () => null);
    }

    receive(pack: MessagePack): void {

    }

    render(g: CanvasRenderingContext2D): void {
        const radius = constrains(this.properties.get(PROPERTY_TYPE_SIZE), 0.0, 1.0) / 2;

        const entries = this.properties.entries();
        const total = sumBy(entries, e => e[1]) || 1;
        let startAngle = 0;
        for (const [type, value] of entries) {
            const angle = (value / total) * (2 * Math.PI);
            g.fillStyle = getColor(type);
            g.beginPath();
            g.moveTo(0.5, 0.5);
            g.arc(0.5, 0.5, radius, startAngle, startAngle + angle);
            g.closePath();
            g.fill();
            startAngle += angle;
        }
        g.fillStyle = "white";
        g.beginPath();
        g.arc(0.5, 0.5, 0.3 * radius, 0, 2 * Math.PI);
        g.fill();
        g.strokeStyle = "black";
        g.beginPath();
        g.arc(0.5, 0.5, radius, 0, 2 * Math.PI);
        g.stroke();
    }

    tick(slot: PartSlot, env: LocatedEnv): void {
        // TEST
        this.drain(env, PROPERTY_TYPE_WATER, 0.5);
        this.drain(env, PROPERTY_TYPE_NUTRITION, 0.2);
        this.grow(0.1);

        // console.log(this.senseInner(PROPERTY_TYPE_SIZE), this.senseInner(PROPERTY_TYPE_NUTRITION), this.senseInner(PROPERTY_TYPE_WATER))

        if (this.senseInner(PROPERTY_TYPE_SIZE) >= 0.8) {
            this.expand(slot);
        }
    }

    expand(slot: PartSlot) {
        if (!slot) return;
        const neighbors = slot.getNeighbors().filter(n => !n.part);
        if (neighbors.length === 0) return;
        const target = randomElement(neighbors);
        target.part = new Part(slot.bion.uidGenerator.generate());
    }

    // 从环境汲取养料
    drain(env: LocatedEnv, type: PropertyType, strength: double): double {
        const amount = env.drain(type, strength) || 0.0;
        this.properties.mutate(type, +amount);
        return amount;
    }

    // 检测内部物质量
    senseInner(type: PropertyType): double {
        return this.properties.get(type) || 0.0;
    }

    // 检测外部物质量
    senseOuter(env: LocatedEnv, type: PropertyType): double {
        return env.sense(type) || 0.0;
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


const COLOR_MAP = new Map<PropertyType, string>([
    [PROPERTY_TYPE_NUTRITION, "yellow"],
    [PROPERTY_TYPE_WATER, "aqua"],
    [PROPERTY_TYPE_SIZE, "gray"],
    [PROPERTY_TYPE_ANTIBODY, "lightgreen"],
    [PROPERTY_TYPE_ANTIGEN, "purple"],
]);

function getColor(type: PropertyType): string {
    return COLOR_MAP.get(type) || "black";
}