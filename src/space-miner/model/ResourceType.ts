import { double } from "../../libs/CommonTypes";

export default class ResourceType {
    readonly name: string;
    readonly hardness: double;
    readonly basicValue: double;

    constructor(name: string, hardness: double = 0, basicValue: double = 0) {
        this.name = name;
        this.hardness = hardness;
        this.basicValue = basicValue;
    }
}