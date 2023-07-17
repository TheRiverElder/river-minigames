import { Pair, double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import City from "./City";
import { Era } from "./Constants";
import Game from "./Game";
import Profile from "./Profile";

export default class Link {
    readonly uid: number;
    readonly position: Pair<double, double>;
    readonly head: City;
    readonly tail: City;
    readonly eras: Array<Era>;
    owner: Nullable<Profile> = null;

    constructor(uid: number, position: Pair<double, double>, head: City, tail: City, eras: Array<Era>, owner: Nullable<Profile> = null) {
        this.uid = uid;
        this.position = position;
        this.head = head;
        this.tail = tail;
        this.eras = eras;
        this.owner = owner;
    }

    static load(data: any, game: Game): Link {
        const link = new Link(
            data.uid,
            data.position,
            game.cities.getOrThrow(data.head),
            game.cities.getOrThrow(data.tail),
            data.eras,
        );
        link.owner = data.owner === null ? null : game.profiles.getOrThrow(data.owner);
        return link;
    }

}