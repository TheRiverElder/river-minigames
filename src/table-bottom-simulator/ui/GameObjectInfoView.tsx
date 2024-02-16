import { Component } from "react";
import { Nullable } from "../../libs/lang/Optional";
import { NumberInput } from "../../libs/ui/NumberInput";
import { TextInput } from "../../libs/ui/TextInput";
import Vector2Input from "../../libs/ui/Vector2Input";
import ControllerBehavior from "../builtin/behavior/ControllerBehavior";
import EditChannel from "../builtin/channal/EditChannel";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";
import "./GameObjectInfoView.scss";
import Behavior from "../simulator/gameobject/Behavior";
import BehaviorType from "../simulator/gameobject/BehaviorType";
import GameObject from "../simulator/gameobject/GameObject";
import GameObjectTag from "../simulator/gameobject/GameObjectTag";

interface GameObjectInfoViewProps {
    gameObject: GameObject;
}

interface GameObjectInfoViewState {
    angleDisplayMode: AngleDisplayMode;
    editingBackground: string;
    editingNewTagName: string;
    selectedBehaviorTypeToAdd: Nullable<BehaviorType>;
}

class GameObjectInfoView extends Component<GameObjectInfoViewProps, GameObjectInfoViewState> {
    constructor(props: GameObjectInfoViewProps) {
        super(props);
        this.state = {
            angleDisplayMode: ANGLE_DISPLAY_MODE_RADIAN,
            editingBackground: props.gameObject.background,
            editingNewTagName: "",
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
        this.props.gameObject.onUiUpdateListeners.add(this.onUiUpdate);
    }

    componentWillUnmount(): void {
        this.props.gameObject.onUiUpdateListeners.remove(this.onUiUpdate);
    }

    render() {
        const gameObject = this.props.gameObject;

        return (
            <div className="GameObjectInfoView">
                <div className="config" key={-1}>
                    <div className="hint">
                        <span>UID: {gameObject.uid}</span>
                    </div>
                    <div className="config-item">
                        <span>位置</span>
                        <Vector2Input
                            value={gameObject.position}
                            onChange={v => {
                                gameObject.position = v;
                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ position: true });
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
                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ size: true });
                            }}
                        />
                    </div>
                    <div className="config-item">
                        <span>角度</span>
                        <NumberInput
                            value={gameObject.rotation}
                            onChange={v => {
                                gameObject.rotation = v;
                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ rotation: true });
                            }}
                        />
                        <span>rad</span>
                    </div>
                    <div className="config-item">
                        <span>形状</span>
                        <TextInput
                            value={gameObject.shape}
                            onChange={v => {
                                gameObject.shape = v;
                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ shape: true });
                            }}
                        />
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
                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ background: true });
                            }}>设定背景图</button>
                        </div>
                    </div>
                    <div className="config-item">
                        <span>标签</span>
                        <div className="tags">
                            {gameObject.tags.values().map((tag) => (
                                <div key={tag.name} className="tag">
                                    <div className="name-bar">
                                        <span className="name">{tag.name}</span>
                                        <button
                                            onClick={() => {
                                                gameObject.tags.remove(tag);
                                                gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ tags: true });
                                            }}
                                        >移除标签</button>
                                    </div>
                                    {tag.values.map((v, index) => (
                                        <span key={index} className="value">
                                            <span className="index">{index}</span>
                                            <TextInput
                                                value={String(v ?? "")}
                                                onChange={v => {
                                                    const numberValue = v && Number(v);
                                                    tag.values[index] = !Number.isNaN(numberValue) ? numberValue : v;
                                                    gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ tags: true });
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    tag.values.splice(index, 1);
                                                    gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ tags: true });
                                                }}
                                            >移除值</button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => {
                                            tag.values.push("");
                                            gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ tags: true });
                                        }}
                                    >新增值</button>
                                </div>
                            ))}
                            <div>
                                <TextInput
                                    value={this.state.editingNewTagName}
                                    onChange={v => this.setState({ editingNewTagName: v })}
                                />
                                <button
                                    disabled={!this.state.editingNewTagName}
                                    onClick={() => {
                                        gameObject.tags.add(new GameObjectTag(this.state.editingNewTagName));
                                        this.setState({ editingNewTagName: "" });
                                        gameObject.doSendGameObjectSelfDataToServerAndUpdateUi({ tags: true });
                                    }}
                                >新标签</button>
                            </div>
                        </div>
                    </div>
                </div>

                {gameObject.behaviors.values().map(behavior => (
                    <div className="config" key={behavior.uid}>
                        <div className="name" key={-1}>
                            <h3>{behavior.type.name}</h3>
                            <span className="hint">UID: {behavior.uid}</span>
                            <button onClick={() => this.removeBehavior(behavior)}>移除</button>
                        </div>
                        {behavior.configItems.map((item, i) => (
                            <div className="config-item" key={i}>
                                <span>{item.name}</span>
                                {item.render({})}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="create-behavior" key={-2}>
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
        simulator.channelGameObject.sendRemoveBehavior(behavior);
    };

    get controllerBehavior(): Nullable<ControllerBehavior> {
        return this.props.gameObject.getBehaviorByType(ControllerBehavior.TYPE);
    }
}

export default GameObjectInfoView;

type AngleDisplayMode = "radian" | "degree";
const ANGLE_DISPLAY_MODE_RADIAN: AngleDisplayMode = "radian";
const ANGLE_DISPLAY_MODE_DEGREE: AngleDisplayMode = "degree";