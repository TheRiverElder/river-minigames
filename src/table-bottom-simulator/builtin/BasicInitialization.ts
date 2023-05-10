import ControlChannel from "../channal/ControlChannel";
import EditChannel from "../channal/EditChannel";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import { BEHAVIOR_TYPE_CONTROLLER } from "./behavior/ControllerBehavior";

export function initializeBasic(simulator: TableBottomSimulatorClient) {
    // 添加控制频道
    simulator.channels.add(new ControlChannel("control", simulator));
    simulator.channels.add(new EditChannel("edit", simulator));

    // 给所有GameObject加上拖动相关的组件
    simulator.behaviorTypes.add(BEHAVIOR_TYPE_CONTROLLER);
    
}