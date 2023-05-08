import { Component, CSSProperties, ReactNode, WheelEvent } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";
import BehaviorDraggable, { BEHAVIOR_TYPE_DRAGGABLE } from "../builtin/behavior/BehaviorDraggable";
import { Consumer, double } from "../../libs/CommonTypes";
import { passOrCreate } from "../../libs/drag/DragPointerEvent";
import { square } from "../../libs/math/Mathmatics";

export interface GameObjectViewProps {
    gameObject: GameObject;
    dragContainer: DragContainer;
    globalOffset: Vector2;
    globalScalar: double;
    onClick?: Consumer<GameObject>;
}

export default class GameObjectView extends Component<GameObjectViewProps> {

    readonly dragElement = new DragElement(
        passOrCreate(this.props.gameObject.getBehaviorByType<BehaviorDraggable>(BEHAVIOR_TYPE_DRAGGABLE)), 
        {
            get: () => this.props.gameObject.position,
            set: (newPosition: Vector2) => {
                const origin = this.props.gameObject.position;
                console.log("origin", origin);
                const delta = newPosition.sub(origin).div(square(this.props.globalScalar));
                console.log("delta", delta);
                this.props.gameObject.position = origin.add(delta);
                console.log("position", this.props.gameObject.position );
            },
        },
        () => this.props.globalScalar,
    );

    onUiUpdate = () => {
        this.forceUpdate();
    };

    onClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.gameObject);
        }
    };

    componentDidMount(): void {
        this.props.gameObject.onUiUpdate.add(this.onUiUpdate);
        this.dragElement.bindContainer(this.props.dragContainer);
        this.dragElement.listeners.onClick.add(this.onClick);
    }

    componentWillUnmount(): void {
        this.props.gameObject.onUiUpdate.remove(this.onUiUpdate);
        this.dragElement.unbindContainer();
        this.dragElement.listeners.onClick.remove(this.onClick);
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
                onWheel={this.onWheel}
            >
                
            </div>
        );
    }

    onWheel = (event: WheelEvent) => {
        event.stopPropagation();
        // event.preventDefault();

        const rotationSpeed = 0.1 * Math.PI;

        const sign = Math.sign(event.deltaY);
        const gameObject = this.props.gameObject;
        gameObject.rotation += sign * rotationSpeed;
        gameObject.onUiUpdate.emit();
    };
}