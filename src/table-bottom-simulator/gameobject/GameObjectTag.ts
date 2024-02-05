import { int } from "../../libs/CommonTypes";
import Persistable from "../io/Persistable";

export type GameObjectTagValue = number | string;

export default class GameObjectTag implements Persistable {

    static restoreGameObjectTag(data: any) {
        const name: string = data.name;
        const tag = new GameObjectTag(name);
        tag.restore(data);
        return tag;
    }

    readonly name: string;
    values: Array<GameObjectTagValue>;

    constructor(name: string, values: Array<GameObjectTagValue> = []) {
        this.name = name;
        this.values = values;
    }

    get value(): GameObjectTagValue { return this.values[0]; }
    set value(v: GameObjectTagValue) { this.values[0] = v; }

    getInt(index: int = 0): int {
        const raw = this.values[index];
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') return parseInt(raw);
        throw Error(`value[${index}] is not a number: ${raw}`);
    }

    getString(index: int = 0): string {
        const raw = this.values[index];
        return raw.toString();
    }

    save(): any {
        return {
            name: this.name,
            values: this.values.slice(),
        };
    }

    restore(data: any) {
        this.values = data.values;
    }
}