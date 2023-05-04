import Vector2 from "../../libs/math/Vector2";
import TableBottomSimulator from "../TableBottomSimulator";
import BehaviorPoinerListener from "./behavior/BehaviorPoinerListener";

export default function initializeTest(simulator: TableBottomSimulator) {
    simulator.root.behaviors.createAndAddBehavior(BehaviorPoinerListener);

    const testObject = simulator.createGameObject(simulator.root);
    testObject.position = new Vector2(100, 100);
    testObject.size = new Vector2(100, 100);
    testObject.rotation = 0.2 * Math.PI;
    testObject.behaviors.createAndAddBehavior(BehaviorPoinerListener);

    simulator.root.addChild(testObject);
}