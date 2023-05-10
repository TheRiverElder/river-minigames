import ControlChannel from "../channal/ControlChannel";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import { BEHAVIOR_TYPE_CONTROLLER } from "./behavior/ControllerBehavior";

export function initializeBasic(simulator: TableBottomSimulatorClient) {
    // 添加控制频道
    simulator.channels.add(new ControlChannel("control", simulator));

    // 给所有GameObject加上拖动相关的组件
    simulator.behaviorTypes.add(BEHAVIOR_TYPE_CONTROLLER);
    
}