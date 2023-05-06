import { Component, MouseEvent, MouseEventHandler, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import { Button, DragPointerEvent } from "../../libs/drag/DragPointerEvent";
import ListenerManager from "../../libs/management/ListenerManager";
import Vector2 from "../../libs/math/Vector2";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import GameObjectView from "./GameObjectView";
import "./TableBottomSimulatorView.scss";

export interface TableBottomSimulatorViewProps {
    simulator: TableBottomSimulator;
}

export default class TableBottomSimulatorView extends Component<TableBottomSimulatorViewProps> {

    readonly dragContainer = new DragContainer();


    onUiUpdate = () => {
        this.forceUpdate();
    };

    componentDidMount(): void {
        console.log("componentDidMount")
        this.props.simulator.onWholeUiUpdate.add(this.onUiUpdate);
    }

    componentWillUnmount(): void {
        console.log("componentWillUnmount")
        this.props.simulator.onWholeUiUpdate.remove(this.onUiUpdate);
    }

    render(): ReactNode {
        console.log("render")

        return (
            <div 
                className="TableBottomSimulatorView"
                onMouseMove={createMouseListener(this.dragContainer.onMove)}
                onMouseUp={createMouseListener(this.dragContainer.onUp)}
            >
                <div className="table">
                    {this.props.simulator.gameObjects.values().map(gameObject => (
                        <GameObjectView key={gameObject.uid} gameObject={gameObject} dragContainer={this.dragContainer}/>
                    ))}
                </div>
            </div>
        )
    }
}

export function createMouseListener(listeners: ListenerManager<DragPointerEvent> | undefined): MouseEventHandler | undefined {
    if (!listeners) return undefined;
    return (event: MouseEvent) => {
        const e: DragPointerEvent = {
            nativeEvent: event.nativeEvent as PointerEvent,
            localPosition: new Vector2(event.nativeEvent.offsetX, event.nativeEvent.offsetY),
            globalPosition: new Vector2(event.nativeEvent.pageX, event.nativeEvent.pageY),
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