import { Component, MouseEvent, MouseEventHandler, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import { Button, DragPointerEvent } from "../../libs/drag/DragPointerEvent";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import GameObjectView from "./GameObjectView";
import "./TableBottomSimulatorView.scss";

export interface TableBottomSimulatorViewProps {
    simulator: TableBottomSimulator;
}

export interface TableBottomSimulatorViewState {
    gameObject: Nullable<GameObject>;
}

export default class TableBottomSimulatorView extends Component<TableBottomSimulatorViewProps, TableBottomSimulatorViewState> {

    constructor(props: TableBottomSimulatorViewProps) {
        super(props);
        this.state = {
            gameObject: null,
        };
    }

    readonly dragContainer = new DragContainer();


    onUiUpdate = () => {
        this.forceUpdate();
    };

    componentDidMount(): void {
        console.log("componentDidMount")
        this.props.simulator.onWholeUiUpdate.add(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemove.add(this.onGameObjectRemove);
    }

    componentWillUnmount(): void {
        console.log("componentWillUnmount")
        this.props.simulator.onWholeUiUpdate.remove(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemove.remove(this.onGameObjectRemove);
    }

    render(): ReactNode {
        console.log("render")

        const gameObject = this.state.gameObject;

        return (
            <div 
                className="TableBottomSimulatorView"
                onMouseMove={createMouseListener(this.dragContainer.onMove)}
                onMouseUp={createMouseListener(this.dragContainer.onUp)}
            >
                <div className="table">
                    {this.props.simulator.gameObjects.values().map(gameObject => (
                        <GameObjectView 
                            key={gameObject.uid} 
                            gameObject={gameObject} 
                            dragContainer={this.dragContainer}
                            onClick={this.onClickGameObject}
                        />
                    ))}
                </div>

                {gameObject && (
                    <div className="game-object-info">
                        <div className="hint">UID: #{gameObject.uid}</div>
                        <div>位置：{gameObject.position.toHunmanReadableString()}</div>
                        <div>尺寸：{gameObject.size.toHunmanReadableString()}</div>
                        <div>角度：{gameObject.rotation.toFixed(3)}rad</div>
                        <div>背景：{gameObject.background}</div>
                    </div>
                )}
            </div>
        )
    }

    onGameObjectRemove = (gameObject: GameObject) => {
        if (this.state.gameObject === gameObject) {
            this.setState(() => ({ gameObject: null }));
        }
    };

    onClickGameObject(gameObject: GameObject) {
        this.props.simulator.gameObjects.get(gameObject.uid).ifPresent(go => {
            if (go === gameObject) {
                this.setState(() => ({ gameObject }));
            }
        });
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