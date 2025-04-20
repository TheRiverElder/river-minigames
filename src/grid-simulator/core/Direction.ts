import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";

export const Directions = Object.freeze({
    UP: new Vector2(0, -1),
    DOWN: new Vector2(0, 1),
    LEFT: new Vector2(-1, 0),
    RIGHT: new Vector2(1, 0),
});

export const DIRECTIONS = Object.values(Directions);

const OPPOSITE_DIRECTION_MAP = new Map<Vector2, Vector2>([
    [Directions.UP, Directions.DOWN],
    [Directions.DOWN, Directions.UP],
    [Directions.LEFT, Directions.RIGHT],
    [Directions.RIGHT, Directions.LEFT],
]);

export function getOppositeDirection(direction: Vector2): Vector2 {
    return OPPOSITE_DIRECTION_MAP.get(direction) ?? direction.mul(0);
}