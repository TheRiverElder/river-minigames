import BasicType from "../../../libs/management/BasicType";
import Game from "../../Game";

export class CreativeType<T> extends BasicType {

    private readonly creator: (game: Game, data: any) => T;

    constructor(id: string, creator: (game: Game, data: any) => T) {
        super(id);
        this.creator = creator;
    }

    create(game: Game, data: any): T {
        return this.creator(game, data);
    }
}