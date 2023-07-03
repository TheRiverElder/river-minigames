import RpcClient from "../../libs/rpc/RpcClient";
import Profile from "../Profile";

export default interface GameStateViewProps {
    profile: Profile;
    rpc: RpcClient;
    refresh: Function;
    data: any;
}