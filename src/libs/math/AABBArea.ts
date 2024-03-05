import { double } from "../CommonTypes";
import Vector2 from "./Vector2";

export default class AABBArea {
    constructor(
        public readonly position: Vector2,
        public readonly size: Vector2,
    ) { }

    get left(): double {
        return Math.min(this.position.x, this.position.x + this.size.x);
    }

    get right(): double {
        return Math.max(this.position.x, this.position.x + this.size.x);
    }

    get top(): double {
        return Math.min(this.position.y, this.position.y + this.size.y);
    }

    get bottom(): double {
        return Math.max(this.position.y, this.position.y + this.size.y);
    }

    public contains(point: Vector2) {
        return (
            point.x >= this.left &&
            point.x < this.right &&
            point.y >= this.top &&
            point.y < this.bottom
        );
    }
}