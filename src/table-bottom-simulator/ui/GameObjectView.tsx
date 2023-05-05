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
        const root = gameObject.simulator.root;
        const behavior: Nullable<BehaviorPoinerListener> = root.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            console.log("GameObjectView.componentDidMount before", "#" + gameObject.uid, behavior.onUiUpdate.size, behavior.onUiUpdate);
            behavior.onUiUpdate.add(this.onUiUpdate);
            console.log("GameObjectView.componentDidMount after", "#" + gameObject.uid, behavior.onUiUpdate.size, behavior.onUiUpdate);
        }
    }

    componentWillUnmount(): void {
        const gameObject = this.props.gameObject;
        const root = gameObject.simulator.root;
        const behavior: Nullable<BehaviorPoinerListener> = root.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            console.log("GameObjectView.componentWillUnmount before", "#" + gameObject.uid, behavior.onUiUpdate.size, behavior.onUiUpdate);
            behavior.onUiUpdate.remove(this.onUiUpdate);
            console.log("GameObjectView.componentWillUnmount after", "#" + gameObject.uid, behavior.onUiUpdate.size, behavior.onUiUpdate);
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
        console.log(style);

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