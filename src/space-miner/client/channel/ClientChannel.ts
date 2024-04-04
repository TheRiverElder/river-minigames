import ChannelManager from "../../common/channel/ChannelManager";
import NamedChannelBase from "../../common/channel/NamedChannelBase";
import SpaceMinerApi from "../SpaceMinerApi";

export default abstract class ClientChannel extends NamedChannelBase {

    constructor(
        manager: ChannelManager,
        public readonly gameApi: SpaceMinerApi,
    ) {
        super(manager);
    }

}