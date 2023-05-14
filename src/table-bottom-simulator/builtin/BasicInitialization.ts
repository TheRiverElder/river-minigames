import EditChannel from "../channal/EditChannel";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import CardBehavior from "./behavior/CardBehavior";
import ControllerBehavior from "./behavior/ControllerBehavior";
import PileBehavior from "./behavior/PileBehavior";

export function initializeBasic(simulator: TableBottomSimulatorClient) {
    // 添加控制频道
    simulator.channels.add(new EditChannel("edit", simulator));

    simulator.behaviorTypes.add(ControllerBehavior.TYPE);
    simulator.behaviorTypes.add(PileBehavior.TYPE);
    simulator.behaviorTypes.add(CardBehavior.TYPE);
    
}