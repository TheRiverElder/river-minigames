import { double, int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";

export interface BodyProps {
    readonly uid: int;
    position?: Vector2;
    velocity?: Vector2;
    mass?: double;
}
 
export default abstract class Body {
    readonly uid: int;
    position: Vector2;
    velocity: Vector2;
    mass: double;

    get radius(): double {
        return Math.sqrt(this.mass / Math.PI);
    }

    constructor(props: BodyProps) {
        this.uid = props.uid;
        this.position = props.position || new Vector2(0, 0);
        this.velocity = props.velocity || new Vector2(0, 0);
        this.mass = props.mass || 100;
    }

    abstract tick(game: Game): void;
    // abstract effect(another: Body): void;

    abstract draw(g: CanvasRenderingContext2D, game: Game): void;
}