import BasicType from "../../../libs/management/BasicType";
import Game from "../../Game";

export interface ContextProps<T> {
    readonly type: CreativeType<T>;
    readonly game: Game;
}

export class CreativeType<T> extends BasicType {

    private readonly creator: (contextProps: ContextProps<T>, data: any) => T;

    constructor(id: string, creator: (contextProps: ContextProps<T>, data: any) => T) {
        super(id);
        this.creator = creator;
    }

    create(game: Game, data?: any): T {
        return this.creator({ type: this, game }, data || {});
    }

    convert(obj: any): T {
        if (obj.type !== this) throw new Error("Cannot convert!");
        return obj as T;
    }
}