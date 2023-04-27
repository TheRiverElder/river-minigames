import { int } from "../libs/CommonTypes";
import Array2D from "../libs/lang/Array2D";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import NumberGenerator from "../libs/math/NumberGenerator";
import MessagePack from "./MessagePack";
import Part from "./Part";
import Vector2 from "../libs/math/Vector2";
import Wave from "./Wave";
import Program from "./program/Program";

export default abstract class Bion {

    readonly gene: Uint8Array;
    readonly program: Program = new Program();
    readonly parts: Map<int, Part> = new Map();
    readonly uidGenerator: NumberGenerator = new IncrementNumberGenerator();
    // readonly connections: ConnectionManager<Part> = new ConnectionManager<Part>();
    readonly board: Array2D<Part | null> = new Array2D(16, 16, () => null);
    readonly waves: Array<Wave> = [];

    constructor(gene: Uint8Array) {
        this.gene = gene;
    }

    public tick(): void {
        this.apply();
        this.board.forEach((part) => part?.tick());
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
        this.board.forEach((part, x, y) => {
            if (!part) return;
            g.save();
            g.translate(x, y);
            part.render(g);
            g.restore();
        })
    }

}