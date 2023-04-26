import Vector2 from "../../libs/math/Vector2"
import City from "../City";
import Player from "../Player";

export default class Traffic {
    readonly position: Vector2;
    readonly head: City;
    readonly tail: City;
    owner: Player;

    constructor(position: Vector2, head: City, tail: City, owner: Player) {
        this.position = position;
        this.head = head;
        this.tail = tail;
        this.owner = owner;
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