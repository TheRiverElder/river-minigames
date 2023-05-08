import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import BirminghamPlayer from "./BirminghamPlayer";

export const REGISTRY_PLAYER = new Registry<int, BirminghamPlayer>(player => player.user.uid);

// 只是注册一些主要的BehaviorType
export default function initializeBirminghamBasic(simulator: TableBottomSimulatorClient) {
    
}