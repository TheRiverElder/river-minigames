import { Container, Sprite, Text } from "pixi.js";
import Orb from "../../model/orb/Orb";

export default interface OrbGraphicData {
    readonly orb: Orb;
    readonly container: Container;
    readonly body: Sprite;
    readonly text: Text;
}