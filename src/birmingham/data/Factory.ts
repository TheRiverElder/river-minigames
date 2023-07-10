import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import FactoryPattern from "./FactoryPattern";
import Game from "./Game";
import Profile from "./Profile";

export default class Factory {
    readonly pattern: FactoryPattern;
    readonly owner: Profile;
    resources: Nullable<[string, int]>;
    sold: boolean = false;

    constructor(pattern: FactoryPattern, owner: Profile, resources: Nullable<[string, int]> = null, sold: boolean) {
        this.pattern = pattern;
        this.owner = owner;
        this.resources = resources;
        this.sold = sold;
    }
    
    static load(data: any, game: Game): Factory {
        const factory = new Factory(
            game.factoryPatterns.getOrThrow(data.pattern), 
            game.profiles.getOrThrow(data.owner),
            data.resources,
            data.sold,
        );
        return factory;
    }
}