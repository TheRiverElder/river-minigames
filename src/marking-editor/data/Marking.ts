import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";

export default class Marking {
    readonly uid: int; 
    position: Vector2;
    size: Vector2;

    constructor(uid: int, position: Vector2 = Vector2.ZERO, size: Vector2 = new Vector2(100, 100)) {
        this.uid = uid;
        this.position = position;
        this.size = size;
    }
}