import { Component, WheelEvent } from "react";
import { double } from "../../libs/CommonTypes";
import DragContainer from "../../libs/drag/DragContainer";
import { createReactMouseListener } from "../../libs/drag/DragPointerEvent";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import { constrains } from "../../libs/math/Mathmatics";
import Vector2 from "../../libs/math/Vector2";
import EditChannel from "../builtin/channal/EditChannel";
import GameObjectInfoView from "./GameObjectInfoView";
import GameObjectView from "./GameObjectView";
import GameWindowsLayer from "./GameWindowsLayer";
import "./TableBottomSimulatorView.scss";
import GameObject from "../simulator/gameobject/GameObject";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";

export interface TableBottomSimulatorViewProps {
    simulator: TableBottomSimulatorClient;
}

export interface TableBottomSimulatorViewState {
    gameObject: Nullable<GameObject>;
    offset: Vector2;
    scalar: double;
}

export default class TableBottomSimulatorView extends Component<TableBottomSimulatorViewProps, TableBottomSimulatorViewState> {
    
    readonly onDragStartListeners = new ListenerManager<Vector2>();
    readonly onDragMoveListeners = new ListenerManager<Vector2>();
    readonly onDragEndListeners = new ListenerManager<Vector2>();
    readonly onClickListeners = new ListenerManager<Vector2>();

    readonly dragContainer = new DragContainer(this, () => this.state.offset);

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

    private onDragMove = (v: Vector2) => {
        this.setState({ offset: v });
    };

    onKeyDown = (event: KeyboardEvent) => {
        // console.log(event)
        const ctrl = event.ctrlKey;
        const alt = event.altKey;
        const key = event.key.toLowerCase();

        if (key === "delete") {
            event.preventDefault();
            event.stopPropagation();
            this.removeGameObject();
        } else if (ctrl && key === "c") {
            event.preventDefault();
            event.stopPropagation();
            this.copyGameObject();
        } else if (ctrl && key === "x") {
            event.preventDefault();
            event.stopPropagation();
            this.cutGameObject();
        } else if (ctrl && key === "v") {
            event.preventDefault();
            event.stopPropagation();
            this.pasteGameObject();
        } else if (alt && key === "n") {
            event.preventDefault();
            event.stopPropagation();
            this.createGameObject();
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
        this.props.simulator.channelGameObject.sendRemoveGameObject(gameObject);
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
        this.props.simulator.channelGameObject.sendRemoveGameObject(gameObject);
        console.log("已删除", gameObject);
    }

    createGameObject() {
        console.log("开始创建");
        const editChannel = this.props.simulator.channels.getOrThrow("edit") as EditChannel;
        editChannel.createEmptyGameObject();
        console.log("已创建");
    }

    override componentDidMount(): void {
        // console.log("componentDidMount")
        document.addEventListener("keydown", this.onKeyDown, false);
        this.dragContainer.listeners.onDragMoveListeners.add(this.onDragMove);
        this.props.simulator.onWholeUiUpdateListeners.add(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemoveListeners.add(this.onGameObjectRemove);
        this.dragContainer.initialize();

        this.setState({ offset: new Vector2(window.innerWidth / 2, window.innerHeight / 2) });

        this.props.simulator.channelGamePlayer.sendRequestUsersAndGamers();
        this.props.simulator.channelCard.sendRequestAllCardSeries();
    }

    override componentWillUnmount(): void {
        // console.log("componentWillUnmount")
        document.removeEventListener("keydown", this.onKeyDown, false);
        this.dragContainer.listeners.onDragMoveListeners.remove(this.onDragMove);
        this.props.simulator.onWholeUiUpdateListeners.remove(this.onUiUpdate);
        this.props.simulator.gameObjects.onRemoveListeners.remove(this.onGameObjectRemove);
    }

    override render() {

        const gameObject = this.state.gameObject;

        return (
            <div 
                className="TableBottomSimulatorView"
                onMouseDown={createReactMouseListener(this.dragContainer.onDown)}
                onMouseMove={createReactMouseListener(this.dragContainer.onMove)}
                onMouseUp={createReactMouseListener(this.dragContainer.onUp)}
                onMouseLeave={createReactMouseListener(this.dragContainer.onLeave)}
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
                            onDomClick={this.onClickGameObjectDom}
                            globalOffset={this.state.offset}
                            globalScalar={this.state.scalar}
                        />
                    ))}
                </div>

                <GameWindowsLayer simulator={this.props.simulator} dragContainer={this.dragContainer} />

                {gameObject && (
                    <div className="game-object-info-wrapper">
                        <button onClick={() => this.setState({ gameObject: null })}>Hide</button>
                        <GameObjectInfoView key={gameObject.uid} gameObject={gameObject}/>
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

    onClickGameObjectDom = (gameObject: GameObject) => {
        this.props.simulator.onGameObjectClicked.emit(gameObject);
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