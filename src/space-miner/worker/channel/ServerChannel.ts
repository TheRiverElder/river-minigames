import ChannelManager from "../../common/channel/ChannelManager";
import NamedChannelBase from "../../common/channel/NamedChannelBase";
import { GameRuntime } from "../main";

export default abstract class ServerChannel extends NamedChannelBase {

    constructor(
        manager: ChannelManager,
        public readonly runtime: GameRuntime,
    ) {
        super(manager);
        this.onInitialize();
    }

    protected onInitialize() { }

}