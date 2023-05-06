import ChannelControl from "../channal/ChannelControl";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import BehaviorDraggable from "./behavior/BehaviorDraggable";

export function initializeBasic(simulator: TableBottomSimulatorClient) {
    // 添加控制频道
    simulator.channels.add(new ChannelControl("control", simulator));

    // 给所有GameObject加上拖动相关的组件
    simulator.gameObjects.onAdd.add(obj => obj.createAndAddClientOnlyBehavior(BehaviorDraggable));
    
}