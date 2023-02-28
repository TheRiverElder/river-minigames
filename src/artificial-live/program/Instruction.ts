import Part from "../Part";

export default abstract class Instruction {

    abstract execute(part: Part, args: Array<any>): void;
    // abstract read(): void;
    // abstract write(): void;
}