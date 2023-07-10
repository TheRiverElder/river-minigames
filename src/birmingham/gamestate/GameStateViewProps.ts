import RpcClient from "../../libs/rpc/RpcClient";
import Game from "../data/Game";
import Profile from "../data/Profile";

export default interface GameStateViewProps {
    game: Game;
    profile: Profile;
    rpc: RpcClient;
    refresh: Function;
    data: any;
}