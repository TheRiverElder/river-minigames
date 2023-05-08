import { Component } from "react";
import { Nullable } from "../../libs/lang/Optional";
import { NumberInput } from "../../libs/ui/NumberInput";
import { TextInput } from "../../libs/ui/TextInput";
import Vector2Input from "../../libs/ui/Vector2Input";
import ControllerBehavior, { BEHAVIOR_TYPE_CONTROLLER } from "../builtin/behavior/ControllerBehavior";
import GameObject from "../gameobject/GameObject";
import "./GameObjectInfoView.scss";

interface GameObjectInfoViewProps {
    gameObject: GameObject;
}
 
interface GameObjectInfoViewState {
    angleDisplayMode: AngleDisplayMode;
    editingBackground: string;
}
 
class GameObjectInfoView extends Component<GameObjectInfoViewProps, GameObjectInfoViewState> {
    constructor(props: GameObjectInfoViewProps) {
        super(props);
        this.state = {
            angleDisplayMode: ANGLE_DISPLAY_MODE_RADIAN,
            editingBackground: props.gameObject.background,
        };
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
                <div className="hint">
                    <span>UID: {gameObject.uid}</span>
                </div>
                <div>
                    <span>位置</span>
                    <Vector2Input 
                        value={gameObject.position}
                        onChange={v => {
                            gameObject.position = v;
                            this.controllerBehavior?.onDragMove.emit(v);
                        }}
                    />
                </div>
                <div>
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
                <div>
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
                <div>
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
        );
    }

    get controllerBehavior(): Nullable<ControllerBehavior> {
        return this.props.gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER);
    }
}
 
export default GameObjectInfoView;

type AngleDisplayMode = "radian" | "degree";
const ANGLE_DISPLAY_MODE_RADIAN: AngleDisplayMode = "radian";
const ANGLE_DISPLAY_MODE_DEGREE: AngleDisplayMode = "degree";