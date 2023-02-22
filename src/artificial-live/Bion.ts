import { int } from "../libs/CommonTypes";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import NumberGenerator from "../libs/math/NumberGenerator";
import ConnectionManager from "./ConnectionManager";
import MessagePack from "./MessagePack";
import Part from "./Part";

export default abstract class Bion {

    readonly gene: Uint8Array;
    readonly parts: Map<int, Part> = new Map();
    readonly uidGenerator: NumberGenerator = new IncrementNumberGenerator();
    readonly connections: ConnectionManager<Part> = new ConnectionManager<Part>();

    constructor(gene: Uint8Array) {
        this.gene = gene;
    }

    public tick() {
        for (const part of Array.from(this.parts.values())) {
            const instructions = part.program.instructions;
            for (const instruction of instructions) {
                instruction.execute();
            }
        }
    }
    
    public submit(pack: MessagePack) {
        for (const part of Array.from(this.parts.values())) {
            part.receive(pack);
        }
    }

}