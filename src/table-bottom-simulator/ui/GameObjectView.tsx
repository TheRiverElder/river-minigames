import { Component, CSSProperties, ReactNode } from "react";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";

export interface GameObjectViewProps {
    gameObject: GameObject;
}

export default class GameObjectView extends Component<GameObjectViewProps> {

    render(): ReactNode {
        const gameObject = this.props.gameObject;

        const style: CSSProperties = Object.assign(
            {
                transform: `
                    rotate(${gameObject.rotation}rad) 
                    transform(-50%, -50%)
                `.trim(),
            },
            gameObject.position.toPositionCss(),
            gameObject.size.toSizeCss(),
        );

        return (
            <div className="GameObjectView" style={style}>

            </div>
        );
    }
}