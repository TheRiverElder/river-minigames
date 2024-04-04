import ChannelBase from "../../common/channel/ChannelBase";
import ChannelManager from "../../common/channel/ChannelManager";
import SpaceMinerApi from "../SpaceMinerApi";

export default abstract class ClientChannel extends ChannelBase {

    constructor(
        manager: ChannelManager,
        public readonly gameApi: SpaceMinerApi,
    ) {
        super(manager);
    }

}