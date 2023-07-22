import Vector2 from "../../libs/math/Vector2";
import OsmosGame from "../Game";
import Body from "./Body";

export default abstract class ActiveBody extends Body {

    // 向某方向喷气
    jet(direction: Vector2, game: OsmosGame) {
        const dividedMass = this.mass * 0.05;
        // this.velocity = this.velocity.add(direction.normalized.mul())
    }

}