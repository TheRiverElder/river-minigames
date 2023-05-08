import { Component, CSSProperties, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement, { DragEventListeners } from "../../libs/drag/DragElement";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";
import BehaviorDraggable from "../builtin/behavior/BehaviorDraggable";
import { Consumer } from "../../libs/CommonTypes";

export interface GameObjectViewProps {
    gameObject: GameObject;
    dragContainer: DragContainer;
    onClick?: Consumer<GameObject>;
}

export default class GameObjectView extends Component<GameObjectViewProps> {

    readonly dragElement = new DragElement(
        passOrCreate(this.props.gameObject.getBehaviorByType<BehaviorDraggable>(BehaviorDraggable)), 
        {
            get: () => this.props.gameObject.position,
            set: (position: Vector2) => this.props.gameObject.position = position,
        },
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
            >
                
            </div>
        );
    }
}

function passOrCreate(listeners: Nullable<DragEventListeners>): DragEventListeners {
    return listeners || {
        onDragStart: new ListenerManager<Vector2>(),
        onDragMove: new ListenerManager<Vector2>(),
        onDragEnd: new ListenerManager<Vector2>(),
        onClick: new ListenerManager<Vector2>(),
    };
}