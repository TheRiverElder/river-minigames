import { Container, DisplayObject, Sprite, Text } from "pixi.js";
import Orb from "../../model/orb/Orb";

export default interface OrbGraphicData {
    readonly orb: Orb;
    readonly container: Container;
    readonly body: Sprite;
    readonly shadow: Sprite;
    readonly text: Text;
    readonly miners: Array<{
        icon: Sprite;
        pointer: DisplayObject;
        container: Container;
    }>;
}