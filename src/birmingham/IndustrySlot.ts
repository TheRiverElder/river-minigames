import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import City from "./City";
import Factory from "./Factory";
import Game from "./Game";
import Industry from "./Industry";
import { UpdatableUnique } from "./UpdatableUnique";

export default class IndustrySlot implements UpdatableUnique {
    readonly uid: int;
    readonly game: Game;
    readonly city: City;
    readonly position: Vector2;
    readonly industries: Set<Industry>;
    factory: Nullable<Factory> = null;

    constructor(game: Game, uid: int, city: City, position: Vector2, industries: Iterable<Industry>, factory: Nullable<Factory> = null) {
        this.game = game;
        this.uid = uid;
        this.city = city;
        this.position = position;
        this.industries = new Set(industries);
        this.factory = factory;

        game.listenUpdate(this);
    }

    update(data: any): void {
        const factoryUid: int = data.factoryUid;
        this.game.factories.get(factoryUid)
                .ifPresent(
                    factory => (this.factory = factory),
                    () => { throw new Error(`Not found: factory with UID(${factoryUid})`) },
                );
    }
}