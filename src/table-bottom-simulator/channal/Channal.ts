import User from "../user/User";

export default abstract class Channal {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract send(data: any): void;

    abstract receive(data: any): void;
}