import Vector2 from "../../libs/math/Vector2";
import OsmosGame from "../Game";
import Body from "./Body";
import NeutralBody from "./NeutralBody";

export default abstract class ActiveBody extends Body {

    // 向某方向喷气
    jet(direction: Vector2, game: OsmosGame) {
        const momentum = this.velocity.mul(this.mass);
        const dividedMass = this.mass * 0.05;
        const dividedVelocity = direction.mul(10.0);
        const dividedPosition = this.position.add(direction.normalized.mul(this.radius));
        const projectile = game.spawn(uid => new NeutralBody({
            uid,
            velocity: dividedVelocity,
            position: dividedPosition,
            mass: dividedMass,
        }));
        this.mass -= dividedMass;
        this.velocity = momentum.sub(dividedVelocity.mul(dividedMass)).div(this.mass);
    }

}