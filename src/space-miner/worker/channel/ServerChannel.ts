import ChannelBase from "../../common/channel/ChannelBase";
import ChannelManager from "../../common/channel/ChannelManager";
import { GameRuntime } from "../main";

export default abstract class ServerChannel extends ChannelBase {

    constructor(
        manager: ChannelManager,
        public readonly runtime: GameRuntime,
    ) {
        super(manager);
        this.onInitialize();
    }

    protected onInitialize() { }

}