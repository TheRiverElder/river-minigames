import { Component, MouseEvent, MouseEventHandler, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import Vector2 from "../../libs/math/Vector2";
import BehaviorPoinerListener, { BehaviorPointerEvent, Button } from "../builtin/behavior/BehaviorPoinerListener";
import TableBottomSimulator from "../TableBottomSimulator";
import GameObjectView from "./GameObjectView";
import "./TableBottomSimulatorView.scss";

export interface TableBottomSimulatorViewProps {
    simulator: TableBottomSimulator;
}

export default class TableBottomSimulatorView extends Component<TableBottomSimulatorViewProps> {


    onUiUpdate = () => {
        this.forceUpdate();
    };

    componentDidMount(): void {
        const root = this.props.simulator.root;
        const behavior: Nullable<BehaviorPoinerListener> = root.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            console.log("TableBottomSimulatorView.componentDidMount before", "#" + root.uid, behavior.onUiUpdate.size);
            behavior.onUiUpdate.add(this.onUiUpdate);
            console.log("TableBottomSimulatorView.componentDidMount after", "#" + root.uid, behavior.onUiUpdate.size);
        }
    }

    componentWillUnmount(): void {
        const root = this.props.simulator.root;
        const behavior: Nullable<BehaviorPoinerListener> = root.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            console.log("TableBottomSimulatorView.componentDidMount before", "#" + root.uid, behavior.onUiUpdate.size);
            behavior.onUiUpdate.remove(this.onUiUpdate);
            console.log("TableBottomSimulatorView.componentDidMount after", "#" + root.uid, behavior.onUiUpdate.size);
        }
    }

    render(): ReactNode {

        const root = this.props.simulator.root;
        const behavior: Nullable<BehaviorPoinerListener> = root.behaviors.getBehavior(BehaviorPoinerListener);

        return (
            <div 
                className="TableBottomSimulatorView"
                onMouseDown={createMouseListener(behavior?.onPointerDown)}
                onMouseMove={createMouseListener(behavior?.onPointerMove)}
                onMouseUp={createMouseListener(behavior?.onPointerUp)}
            >
                <div className="table">
                    {this.props.simulator.gameObjects.values().map(gameObject => (
                        <GameObjectView gameObject={gameObject}/>
                    ))}
                </div>
            </div>
        )
    }
}

export function createMouseListener(listeners: ListenerManager<BehaviorPointerEvent> | undefined): MouseEventHandler | undefined {
    if (!listeners) return undefined;
    return (event: MouseEvent) => {
        const e: BehaviorPointerEvent = {
            nativeEvent: event.nativeEvent as PointerEvent,
            position: new Vector2(event.nativeEvent.offsetX, event.nativeEvent.offsetY),
            button: getButton(event.button),
        };
        listeners.emit(e);
    };
}

function getButton(b: number): Button {
    switch (b) {
        case 0: return Button.LEFT;
        case 1: return Button.MIDDLE;
        case 2: return Button.RIGHT;
        default: return Button.LEFT;
    }
}