import { int } from "../../../libs/CommonTypes";
import ScreenChannel from "./ScreenChannel";

export default interface GameScreen {
    readonly uid: int;
    readonly channel: ScreenChannel;
    receive<T = any>(command: string, data?: any): T;
}