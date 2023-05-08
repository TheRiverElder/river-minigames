import { Component } from "react";
import { NumberInput } from "../../libs/ui/NumberInput";
import Vector2Input from "../../libs/ui/Vector2Input";
import GameObject from "../gameobject/GameObject";
import "./GameObjectInfoView.scss";

interface GameObjectInfoViewProps {
    gameObject: GameObject;
}
 
interface GameObjectInfoViewState {
    
}
 
class GameObjectInfoView extends Component<GameObjectInfoViewProps, GameObjectInfoViewState> {
    constructor(props: GameObjectInfoViewProps) {
        super(props);
        this.state = {
            
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
                    <span>UID</span>
                    <span>{gameObject.uid}</span>
                </div>
                <div>
                    <span>位置</span>
                    <Vector2Input 
                        value={gameObject.position}
                        onChange={v => gameObject.position = v}
                    />
                </div>
                <div>
                    <span>尺寸</span>
                    <Vector2Input 
                        value={gameObject.size}
                        onChange={v => gameObject.size = v}
                    />
                </div>
                <div>
                    <span>角度</span>
                    <NumberInput 
                        value={gameObject.rotation}
                        onChange={v => gameObject.rotation = v}
                    />
                </div>
                <div>
                    <span>背景</span>
                    {gameObject.background}
                    <img
                        alt="background"
                        src="gameObject.background"
                    />
                </div>
            </div>
        );
    }
}
 
export default GameObjectInfoView;