import { Component, CSSProperties, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import BehaviorPoinerListener from "../builtin/behavior/BehaviorPoinerListener";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";

export interface GameObjectViewProps {
    gameObject: GameObject;
}

export default class GameObjectView extends Component<GameObjectViewProps> {

    onUiUpdate = () => {
        this.forceUpdate();
    };

    componentDidMount(): void {
        const gameObject = this.props.gameObject;
        const behavior: Nullable<BehaviorPoinerListener> = gameObject.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            behavior.onUiUpdate.add(this.onUiUpdate);
        }
    }

    componentWillUnmount(): void {
        const gameObject = this.props.gameObject;
        const behavior: Nullable<BehaviorPoinerListener> = gameObject.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            behavior.onUiUpdate.remove(this.onUiUpdate);
        }
    }
    
    render(): ReactNode {
        
        const gameObject = this.props.gameObject;
        const behavior: Nullable<BehaviorPoinerListener> = gameObject.behaviors.getBehavior(BehaviorPoinerListener);

        const style: CSSProperties = {
            transform: `
                translate(-50%, -50%)
                rotate(${gameObject.rotation}rad) 
            `.trim(),
            ...gameObject.position.toPositionCss(),
            ...gameObject.size.toSizeCss(),
        };
        // console.log(style);

        return (
            <div 
                className="GameObjectView" 
                style={style}
                onMouseDown={createMouseListener(behavior?.onPointerDown)}
                onMouseMove={createMouseListener(behavior?.onPointerMove)}
                onMouseUp={createMouseListener(behavior?.onPointerUp)}
            >

            </div>
        );
    }
}