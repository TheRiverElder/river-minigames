import { int } from "../libs/CommonTypes";
import { computeIfAbsent } from "../libs/lang/Collections";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import NumberGenerator from "../libs/math/NumberGenerator";
import ConnectionManager from "./ConnectionManager";
import MessagePack, { MessagePackType } from "./MessagePack";
import Part from "./Part";

export default abstract class Bion {

    readonly gene: Uint8Array;
    readonly parts: Map<int, Part> = new Map();
    readonly uidGenerator: NumberGenerator = new IncrementNumberGenerator();
    readonly connections: ConnectionManager<Part> = new ConnectionManager<Part>();

    constructor(gene: Uint8Array) {
        this.gene = gene;
    }

    abstract tick(): void;

    private tickPartPrograms() {
        // for (const part of Array.from(this.parts.values())) {
        //     const instructions = part.program.instructions;
        //     for (const instruction of instructions) {
        //         instruction.execute();
        //     }
        // }
    }

    private messagePackPool: Map<MessagePackType, number> = new Map();
    
    public submit(pack: MessagePack) {
        this.messagePackPool.set(pack.type, computeIfAbsent(this.messagePackPool, pack.type, () => 0) + pack.amount);
    }

    public apply() {
        const cache = Array.from(this.messagePackPool.entries())
            .map(([type, amount]) => new MessagePack(type, amount))
            .filter(pack => pack.amount !== 0);
        
        this.messagePackPool.clear();

        for (const pack of cache) {
            for (const part of Array.from(this.parts.values())) {
                part.receive(pack);
            }
        }
    }

    render(g: CanvasRenderingContext2D) {
        Array.from(this.parts.values()).forEach(part => part.render(g))
    }

}