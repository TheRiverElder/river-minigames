import { ReactNode } from "react";
import RpcClient from "../libs/rpc/RpcClient";
import Profile from "./Profile";

export interface GameStateRenderContext {
    profile: Profile;
    rpc: RpcClient;
    updateUi: () => void;
}

export default interface GameState {
    render(context: GameStateRenderContext): ReactNode;
}