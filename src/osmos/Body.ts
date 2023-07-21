import Vector2 from "../libs/math/Vector2";

export interface BodyProps {
    position?: Vector2;
    velocity?: Vector2;
}

export default class Body {
    position: Vector2;
    velocity: Vector2;

    constructor(props: BodyProps) {
        this.position = props.position || new Vector2(0, 0);
        this.velocity = props.velocity || new Vector2(0, 0);
    }
}