import { Container, DisplayObject, Sprite, Text } from "pixi.js";
import { int } from "../../../libs/CommonTypes";

export default interface OrbGraphicData {
    readonly orbUid: int;
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