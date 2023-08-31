import { double } from "../../libs/CommonTypes";

export default class ResourceType {
    readonly name: string;
    readonly hardness: double;
    readonly temperature: double;
    readonly tags: Set<string>;

    constructor(name: string, hardness: double = 0, temperature: double = 20, tags: ArrayLike<string> = []) {
        this.name = name;
        this.hardness = hardness;
        this.temperature = temperature;
        this.tags = new Set(Array.from(tags));
    }
}