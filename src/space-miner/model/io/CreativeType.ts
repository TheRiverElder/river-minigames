import BasicType from "../../../libs/management/BasicType";
import Game from "../global/Game";


export type CreativeTypeCreator<T, S = Game, D = any> = (type: CreativeType<T, S, D>, staticData: S, dynamicData: D) => T;

export class CreativeType<T, S = Game, D = void> extends BasicType {

    private readonly creator: CreativeTypeCreator<T, S, D>;

    constructor(id: string, creator: CreativeTypeCreator<T, S, D>) {
        super(id);
        this.creator = creator;
    }

    create(staticData: S, dynamicData: D): T {
        return this.creator(this, staticData, dynamicData as any);
    }

    convert(obj: any): T {
        if (obj.type !== this) throw new Error("Cannot convert!");
        return obj as T;
    }
}