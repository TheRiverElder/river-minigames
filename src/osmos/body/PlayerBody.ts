import Game from "../Game";
import ActiveBody from "./ActiveBody";
import Body from "./Body";

export default class PlayerBody extends ActiveBody {
    
    override tick(game: Game): void { }

    override draw(g: CanvasRenderingContext2D, game: Game): void {
        g.fillStyle = "blue";
        g.beginPath();
        g.arc(0, 0, this.radius, 0, 2 * Math.PI);
        g.fill();
    }

    effect(another: Body): void { }

    
    
}