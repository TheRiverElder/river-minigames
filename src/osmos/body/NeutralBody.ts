import Game from "../Game";
import Body from "./Body";

export default class NeutralBody extends Body {
    
    override tick(game: Game): void { }

    override draw(g: CanvasRenderingContext2D, game: Game): void {
        g.fillStyle = "skyblue";
        g.beginPath();
        g.arc(0, 0, this.radius, 0, 2 * Math.PI);
        g.fill();
    }
    
}