import { Component } from "react";
import { Nullable } from "../../libs/lang/Optional";
import { NumberInput } from "../../libs/ui/NumberInput";
import { TextInput } from "../../libs/ui/TextInput";
import Vector2Input from "../../libs/ui/Vector2Input";
import ControllerBehavior, { BEHAVIOR_TYPE_CONTROLLER } from "../builtin/behavior/ControllerBehavior";
import EditChannel from "../channal/EditChannel";
import Behavior from "../gameobject/Behavior";
import BehaviorType from "../gameobject/BehaviorType";
import GameObject from "../gameobject/GameObject";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import ConfigItemView from "./config/ConfigItemView";
import "./GameObjectInfoView.scss";

interface GameObjectInfoViewProps {
    gameObject: GameObject;
}
 
interface GameObjectInfoViewState {
    angleDisplayMode: AngleDisplayMode;
    editingBackground: string;
    selectedBehaviorTypeToAdd: Nullable<BehaviorType>;
}
 
class GameObjectInfoView extends Component<GameObjectInfoViewProps, GameObjectInfoViewState> {
    constructor(props: GameObjectInfoViewProps) {
        super(props);
        this.state = {
            angleDisplayMode: ANGLE_DISPLAY_MODE_RADIAN,
            editingBackground: props.gameObject.background,
            selectedBehaviorTypeToAdd: props.gameObject.simulator.behaviorTypes.values()[0] || null,
        };
    }

    get simulator(): TableBottomSimulatorClient {
        return this.props.gameObject.simulator;
    }

    onUiUpdate = () => {
        this.forceUpdate();  
    };

    componentDidMount(): void {
        this.props.gameObject.onUiUpdate.add(this.onUiUpdate);
    }

    componentWillUnmount(): void {
        this.props.gameObject.onUiUpdate.remove(this.onUiUpdate);
    }

    render() {
        const gameObject = this.props.gameObject;

        return (
            <div className="GameObjectInfoView">
                <div className="config">
                    <div className="hint">
                        <span>UID: {gameObject.uid}</span>
                    </div>
                    <div className="config-item">
                        <span>位置</span>
                        <Vector2Input 
                            value={gameObject.position}
                            onChange={v => {
                                gameObject.position = v;
                                this.controllerBehavior?.onDragMove.emit(v);
                            }}
                        />
                    </div>
                    <div className="config-item">
                        <span>尺寸</span>
                        <Vector2Input 
                            allowKeepAspectRatio
                            value={gameObject.size}
                            onChange={v => {
                                gameObject.size = v;
                                this.controllerBehavior?.onResize.emit(v);
                            }}
                        />
                    </div>
                    <div className="config-item">
                        <span>角度</span>
                        <NumberInput 
                            value={gameObject.rotation}
                            onChange={v => {
                                gameObject.rotation = v;
                                this.controllerBehavior?.onRotate.emit(v);
                            }}
                        />
                        <span>rad</span>
                    </div>
                    <div className="config-item">
                        <span>背景</span>
                        <div className="image-preview">
                            <img
                                alt="background"
                                src={gameObject.background}
                            />
                            <TextInput
                                value={this.state.editingBackground}
                                onChange={v => this.setState({ editingBackground: v })}
                            />
                            <button onClick={() => {
                                gameObject.background = this.state.editingBackground;
                                this.controllerBehavior?.doSendDataToServerAndUpdateUi();
                            }}>设定背景图</button>
                        </div>
                    </div>
                </div>

                {gameObject.behaviors.values().map(behavior => (
                    <div className="config" key={behavior.uid}>
                        <div className="name">
                            <h3>{behavior.type.name}</h3>
                            <span className="hint">UID: {behavior.uid}</span>
                            <button onClick={() => this.removeBehavior(behavior)}>移除</button>
                        </div>
                        {behavior.configItems.map((item, i) => (
                            <div className="config-item" key={i}>
                                <span>{item.name}</span>
                                <ConfigItemView item={item}/>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="create-behavior">
                    <span>添加行为</span>
                    <select
                        value={this.state.selectedBehaviorTypeToAdd?.name}
                        onChange={e => this.setState({ selectedBehaviorTypeToAdd: this.simulator.behaviorTypes.get(e.target.value).orNull() })}
                    >
                        {this.simulator.behaviorTypes.values().map(type => (
                            <option key={type.name} value={type.name}>{type.name}</option>
                        ))}
                    </select>
                    <button
                        disabled={!this.state.selectedBehaviorTypeToAdd}
                        onClick={this.createBehavior}
                    >添加</button>
                </div>
            </div>
        );
    }

    createBehavior = () => {
        const type = this.state.selectedBehaviorTypeToAdd;
        if (!type) return;
        const simulator = this.simulator;
        const editChannel = simulator.channels.getOrThrow("edit") as EditChannel;
        editChannel.createBehavior(this.props.gameObject, type);
    };

    removeBehavior = (behavior: Behavior) => {
        const simulator = this.simulator;
        const editChannel = simulator.channels.getOrThrow("edit") as EditChannel;
        editChannel.removeBehavior(behavior);
    };

    get controllerBehavior(): Nullable<ControllerBehavior> {
        return this.props.gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER);
    }
}
 
export default GameObjectInfoView;

type AngleDisplayMode = "radian" | "degree";
const ANGLE_DISPLAY_MODE_RADIAN: AngleDisplayMode = "radian";
const ANGLE_DISPLAY_MODE_DEGREE: AngleDisplayMode = "degree";