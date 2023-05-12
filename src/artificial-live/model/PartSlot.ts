
import { filterNotNull } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Direction from "../program/Direction";
import Bion from "./Bion";
import BionEnvironment from "./BionEnvironment";
import LocatedEnv from "./LocatedEnv";
import Part from "./Part";

export default class PartSlot {
    public readonly bion: Bion;
    public readonly position: Vector2;
    public part: Nullable<Part> = null;

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