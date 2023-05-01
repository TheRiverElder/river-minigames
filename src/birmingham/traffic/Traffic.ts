import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2"
import City from "../City";
import Game from "../Game";
import Player from "../Player";
import { UpdatableUnique } from "../UpdatableUnique";
import { TrafficType } from "./TrafficType";

export default class Traffic implements UpdatableUnique {
    readonly uid: int;
    readonly game: Game;
    readonly type: TrafficType;
    readonly position: Vector2;
    readonly head: City;
    readonly tail: City;
    owner: Nullable<Player>;

    constructor(game: Game, uid: int, type: TrafficType, position: Vector2, head: City, tail: City, owner: Nullable<Player>) {
        this.game = game;
        this.uid = uid;
        this.type = type;
        this.position = position;
        this.head = head;
        this.tail = tail;
        this.owner = owner;

        game.listenUpdate(this);
    }
    
    update(data: any): void {
        const playerUid = data.playerUid;
        this.game.players.get(playerUid)
                .ifPresent(
                    player => (this.owner = player),
                    () => { throw new Error(`Not found: player with UID(${playerUid})`) },
                );
    }

    getAnotherEnd(start: City): City {
        if (start === this.head) return this.tail;
        if (start === this.tail) return this.head;
        throw new Error("不在该网道中！");
    }

    isOneEnd(city: City): boolean {
        return city === this.head || city === this.tail;
    }

    getEnds(): [City, City] {
        return [this.head, this.tail];
    }
    
    isBuilt() {
        return !!this.owner;
    }
}