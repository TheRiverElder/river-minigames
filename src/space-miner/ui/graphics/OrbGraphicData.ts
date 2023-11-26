import { Container, DisplayObject, Sprite, Text } from "pixi.js";
import { int } from "../../../libs/CommonTypes";
import Orb from "../../model/orb/Orb";

export default interface OrbGraphicData {
    readonly orb: Orb;
    readonly container: Container;
    readonly body: Sprite;
    readonly shadow: Sprite;
    text: Text; // TODO fix this bug
    appearTime: int;
    readonly miners: Array<{
        icon: Sprite;
        pointer: DisplayObject;
        container: Container;
    }>;
}