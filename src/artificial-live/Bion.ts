import { int } from "../libs/CommonTypes";
import Array2D from "../libs/lang/Array2D";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import NumberGenerator from "../libs/math/NumberGenerator";
import MessagePack from "./MessagePack";
import Part from "./Part";
import Vector2 from "../libs/math/Vector2";
import Wave from "./Wave";
import Program from "./program/Program";
import Registry from "../libs/management/Registry";
import PartSlot from "./PartSlot";
import BionEnvironment from "./BionEnvironment";

export default abstract class Bion {

    readonly gene: Uint8Array;
    readonly program: Program = new Program();
    readonly parts = new Registry<int, Part>(part => part.uid);
    readonly uidGenerator: NumberGenerator = new IncrementNumberGenerator();
    // readonly connections: ConnectionManager<Part> = new ConnectionManager<Part>();
    readonly board: Array2D<PartSlot> = new Array2D(16, 16, (x, y) => new PartSlot(this, new Vector2(x, y)));
    readonly waves: Array<Wave> = [];

    constructor(gene: Uint8Array) {
        this.gene = gene;
    }

    public createPartAt(x: int, y: int): Part {
        const part = new Part(this.uidGenerator.generate());
        const slot = this.board.getOrNull(x, y);
        if (!slot) throw new Error(`Slot at (${x}, ${y}) not exists`);
        slot.part = part;
        this.parts.add(part);
        return part;
    }

    public tick(env: BionEnvironment): void {
        this.apply();
        this.board.forEach(slot => slot.tick(env));
    }

    private tickPartPrograms() {
        // for (const part of Array.from(this.parts.values())) {
        //     const instructions = part.program.instructions;
        //     for (const instruction of instructions) {
        //         instruction.execute();
        //     }
        // }
    }

    // private messagePackPool: Map<MessagePackType, number> = new Map();
    
    public submit(pack: MessagePack, sourcePosition: Vector2) {
        // this.messagePackPool.set(pack.type, computeIfAbsent(this.messagePackPool, pack.type, () => 0) + pack.amount);
        this.waves.push(new Wave(this, sourcePosition, pack.type, pack.amount));
    }

    public apply() {
        // const cache = Array.from(this.messagePackPool.entries())
        //     .map(([type, amount]) => new MessagePack(type, amount))
        //     .filter(pack => pack.amount !== 0);
        
        // this.messagePackPool.clear();

        // for (const pack of cache) {
        //     for (const part of Array.from(this.parts.values())) {
        //         part.receive(pack);
        //     }
        // }
 
        for (let i = 0; i < this.waves.length;) {
            const wave = this.waves[i];
            if (wave.exist()) {
                wave.apply();
                i++;
            } else {
                this.waves.splice(i, 1);
            }
        }
    }

    render(g: CanvasRenderingContext2D) {
        this.board.forEach((slot, x, y) => {
            if (!slot.part) return;
            g.save();
            g.translate(x, y);
            slot.part.render(g);
            g.restore();
        })
    }

}