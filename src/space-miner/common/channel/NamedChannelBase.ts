import ChannelBase from "./ChannelBase";

export default abstract class NamedChannelBase extends ChannelBase {

    abstract get name(): string;

}