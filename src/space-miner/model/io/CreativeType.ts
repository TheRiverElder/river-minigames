import BasicType from "../../../libs/management/BasicType";
import Game from "../global/Game";

export interface ContextProps<T, G = Game> {
    readonly type: CreativeType<T, G>;
    readonly game: G;
}

export class CreativeType<T, G = Game, D = any> extends BasicType {

    private readonly creator: (contextProps: ContextProps<T, G>, data?: D) => T;

    constructor(id: string, creator: (contextProps: ContextProps<T, G>, data: any) => T) {
        super(id);
        this.creator = creator;
    }

    create(game: G, data?: D): T {
        return this.creator({ type: this, game }, data);
    }

    convert(obj: any): T {
        if (obj.type !== this) throw new Error("Cannot convert!");
        return obj as T;
    }
}