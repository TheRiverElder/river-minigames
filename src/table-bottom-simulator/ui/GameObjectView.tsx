import { Component, CSSProperties, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";

export interface GameObjectViewProps {
    gameObject: GameObject;
    dragContainer: DragContainer;
}

export default class GameObjectView extends Component<GameObjectViewProps> {

    readonly dragElement = new DragElement({
        get: () => this.props.gameObject.position,
        set: (position: Vector2) => this.props.gameObject.position = position,
    });

    onUiUpdate = () => {
        this.forceUpdate();
    };

    componentDidMount(): void {
        this.props.gameObject.onUiUpdate.add(this.onUiUpdate);
        this.dragElement.bindContainer(this.props.dragContainer);
    }

    componentWillUnmount(): void {
        this.props.gameObject.onUiUpdate.remove(this.onUiUpdate);
        this.dragElement.unbindContainer();
    }
    
    render(): ReactNode {
        
        const gameObject = this.props.gameObject;

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
                onMouseDown={createMouseListener(this.dragElement.onDown)}
                onMouseUp={createMouseListener(this.dragElement.onUp)}
            >

            </div>
        );
    }
}