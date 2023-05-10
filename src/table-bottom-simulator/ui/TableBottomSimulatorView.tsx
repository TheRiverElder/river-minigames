import { Component, MouseEvent, MouseEventHandler, ReactNode, WheelEvent } from "react";
import { double } from "../../libs/CommonTypes";
import DragContainer from "../../libs/drag/DragContainer";
import { Button, DragPointerEvent } from "../../libs/drag/DragPointerEvent";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import { constrains } from "../../libs/math/Mathmatics";
import Vector2 from "../../libs/math/Vector2";
import EditChannel from "../channal/EditChannel";
import GameObject from "../gameobject/GameObject";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import GameObjectInfoView from "./GameObjectInfoView";
import GameObjectView from "./GameObjectView";
import "./TableBottomSimulatorView.scss";

export interface TableBottomSimulatorViewProps {
    simulator: TableBottomSimulator;
}

export interface TableBottomSimulatorViewState {
    gameObject: Nullable<GameObject>;
    offset: Vector2;
    scalar: double;
}

export default class TableBottomSimulatorView extends Component<TableBottomSimulatorViewProps, TableBottomSimulatorViewState> {
    
    readonly onDragStart = new ListenerManager<Vector2>();
    readonly onDragMove = new ListenerManager<Vector2>();
    readonly onDragEnd = new ListenerManager<Vector2>();
    readonly onClick = new ListenerManager<Vector2>();

    readonly dragContainer = new DragContainer(this, {
        get: () => this.state.offset,
        set: offset => this.setState({ offset: offset }),
    });

    constructor(props: TableBottomSimulatorViewProps) {
        super(props);
        this.state = {
            gameObject: null,
            offset: Vector2.zero(),
            scalar: 1.0,
        };
    }

    onUiUpdate = () => {
        this.forceUpdate();
    };

    onKey = (event: KeyboardEvent) => {
        if (!event.ctrlKey) return; 
        event.preventDefault();
        switch (event.key.toLowerCase()) {
            case "c": this.copyGameObject(); break;
            case "x": this.cutGameObject(); break;
            case "v": this.pasteGameObject(); break;
            case "delete": this.removeGameObject(); break;
        }
    };

    copyGameObject() {
        console.log("开始复制");
        const gameObject = this.state.gameObject;
        if (!gameObject) return;
        const data = gameObject.save();
        navigator.clipboard.writeText(JSON.stringify(data));
        console.log("已复制", data);
    }

    cutGameObject() {
        console.log("开始剪切", this.state.gameObject);
        const gameObject = this.state.gameObject;
        if (!gameObject) return;
        const data = gameObject.save();
        const editChannel = this.props.simulator.channels.getOrThrow("edit") as EditChannel;
        editChannel.removeGameObject(gameObject);
        navigator.clipboard.writeText(JSON.stringify(data));
        console.log("已剪切", data);
    }

    async pasteGameObject() {
        console.log("开始粘贴");
        const str = await navigator.clipboard.readText();
        try {
            const data = JSON.parse(str);
            const editChannel = this.props.simulator.channels.getOrThrow("edit") as EditChannel;
            editChannel.pasteGameObject(data);
            console.log("已粘贴", data);
        } catch (e) { }
    }

    removeGameObject() {
        console.log("开始删除");
        const gameObject = this.state.gameObject;
        if (!gameObject) return;
        const editChannel = this.props.simulator.channels.getOrThrow("edit") as EditChannel;
        editChannel.removeGameObject(gameObject);
        console.log("已删除", gameObject);
    }

    componentDidMount(): void {
        // console.log("componentDidMount")
        window.addEventListener("keyup", this.onKey);
        this.props.simulator.onWholeUiUpdate.add(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemove.add(this.onGameObjectRemove);
        this.dragContainer.initialize();

        this.setState({ offset: new Vector2(window.innerWidth / 2, window.innerHeight / 2) });
    }

    componentWillUnmount(): void {
        // console.log("componentWillUnmount")
        window.removeEventListener("keyup", this.onKey);
        this.props.simulator.onWholeUiUpdate.remove(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemove.remove(this.onGameObjectRemove);
    }

    render(): ReactNode {

        const gameObject = this.state.gameObject;

        return (
            <div 
                className="TableBottomSimulatorView"
                onMouseDown={createMouseListener(this.dragContainer.onDown)}
                onMouseMove={createMouseListener(this.dragContainer.onMove)}
                onMouseUp={createMouseListener(this.dragContainer.onUp)}
                onMouseLeave={createMouseListener(this.dragContainer.onLeave)}
                onWheel={this.onWheel}
            >
                <div 
                    className="table"
                    style={{
                        ...this.state.offset.toPositionCss(),
                        transform: `
                            scale(${this.state.scalar})
                        `.trim(),
                    }}
                >
                    {this.props.simulator.gameObjects.values().map(gameObject => (
                        <GameObjectView 
                            key={gameObject.uid} 
                            gameObject={gameObject} 
                            dragContainer={this.dragContainer}
                            onClick={this.onClickGameObject}
                            globalOffset={this.state.offset}
                            globalScalar={this.state.scalar}
                        />
                    ))}
                </div>

                {gameObject && (
                    <div className="game-object-info-wrapper">
                        <button onClick={() => this.setState({ gameObject: null })}>Hide</button>
                        <GameObjectInfoView gameObject={gameObject}/>
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

    onClickGameObject = (gameObject: GameObject) => {
        this.props.simulator.gameObjects.get(gameObject.uid).ifPresent(go => {
            if (go === gameObject) {
                this.setState(() => ({ gameObject }));
            }
        });
    }

    onWheel = (event: WheelEvent) => {
        event.stopPropagation();
        // event.preventDefault();

        const scalarSpeed = -0.1;

        const sign = Math.sign(event.deltaY);
        this.setState((s: TableBottomSimulatorViewState) => {

            const originScalar = s.scalar;
            const originOffset = s.offset;
            const newScalar = constrains(originScalar + sign * scalarSpeed, 0.1, 10.0);
            const windowCenter = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
            const newOffset = originOffset.sub(windowCenter).mul(newScalar / originScalar - 1).add(originOffset);

            return {
                scalar: newScalar,
                offset: newOffset,
            };
        });
    };
}

export function createMouseListener(listeners: ListenerManager<DragPointerEvent> | undefined): MouseEventHandler | undefined {
    if (!listeners) return undefined;
    // console.log(listeners)
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