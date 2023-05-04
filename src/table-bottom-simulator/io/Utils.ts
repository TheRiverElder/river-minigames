import Vector2 from "../../libs/math/Vector2";


export function serializeVector2(vector: Vector2): any {
    return { x: vector.x, y: vector.y };
}

export function deserializeVector2(data: any): Vector2 {
    return new Vector2(data.x, data.y);
}