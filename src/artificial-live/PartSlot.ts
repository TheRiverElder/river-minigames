import { double } from "../libs/CommonTypes";
import { filterNotNull } from "../libs/lang/Collections";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import Bion from "./Bion";
import BionEnvironment from "./BionEnvironment";
import { PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_WATER } from "./instances/neublumen/NeublumenPropertyTypes";
import LocatedEnv from "./LocatedEnv";
import Part from "./Part";
import Direction from "./program/Direction";
import { PropertyType } from "./PropertyManager";

export default class PartSlot {
    public readonly bion: Bion;
    public readonly position: Vector2;
    public part: Nullable<Part> = null;
    // private _part: Nullable<Part> = null;
    // get part(): Nullable<Part> {
    //     return this._part;
    // }
    // set part(part: Nullable<Part>) {
    //     this._part && (this._part.slot = null);
    //     this._part = part;
    //     if (part) {
    //         part.slot && (part.slot._part = null);
    //         part.slot = this;
    //     }
    // }

    constructor(bion: Bion, position: Vector2) {
        this.bion = bion;
        this.position = position;
    }

    tick(env: BionEnvironment) {
        this.part?.tick(this, new LocatedEnv(this.position, env));
    }

    getByOffset(offset: Vector2): Nullable<PartSlot> {
        return this.bion.board.getOrNull(this.position.x + offset.x, this.position.y + offset.y);
    }

    getByDirection(direction: Direction): Nullable<PartSlot> {
        return this.getByOffset(direction.offset);
    }

    getNeighbors(): Array<PartSlot> {
        return filterNotNull([Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].map(d => this.getByDirection(d)));
    }
}