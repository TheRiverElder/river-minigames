import { Nullable } from "../../libs/lang/Optional";
import User from "./User";

export default class Gamer {
    readonly name: string;
    readonly color: string;

    user: Nullable<User> = null;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}