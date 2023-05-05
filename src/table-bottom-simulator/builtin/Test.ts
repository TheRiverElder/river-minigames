import Vector2 from "../../libs/math/Vector2";
import TableBottomSimulator from "../TableBottomSimulator";
import BehaviorDrag from "./behavior/BehaviorDrag";
import BehaviorPoinerListener from "./behavior/BehaviorPoinerListener";

export default function initializeTest(simulator: TableBottomSimulator) {
    simulator.root.behaviors.createAndAddBehavior(BehaviorPoinerListener);

    const testObject = simulator.createGameObject();
    testObject.position = new Vector2(100, 100);
    testObject.size = new Vector2(100, 100);
    testObject.rotation = 0.2 * Math.PI;
    testObject.behaviors.createAndAddBehavior(BehaviorPoinerListener);
    testObject.behaviors.createAndAddBehavior(BehaviorDrag);

    simulator.root.addChild(testObject);

    console.log("initializeTest root", (simulator.root.behaviors.getBehavior(BehaviorPoinerListener) as BehaviorPoinerListener).onUiUpdate.size);
    console.log("initializeTest testObject", (testObject.behaviors.getBehavior(BehaviorPoinerListener) as BehaviorPoinerListener).onUiUpdate.size);
}