import { double } from "../../libs/CommonTypes";

export default class ResourceType {
    readonly name: string;
    readonly hardness: double;

    constructor(name: string, hardness: double) {
        this.name = name;
        this.hardness = hardness;
    }
}