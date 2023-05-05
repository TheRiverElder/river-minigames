import User from "../user/User";

export default abstract class Channal {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract clientSend(data: any): void;
    abstract serverSend(data: any, receiver: User): void;

    abstract clientReceive(data: any): void;
    abstract serverReceive(data: any, user: User): void;
}