import { Component, CSSProperties, ReactNode, WheelEvent } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";
import BehaviorDraggable, { BEHAVIOR_TYPE_CONTROLLER } from "../builtin/behavior/ControllerBehavior";
import { Consumer, double } from "../../libs/CommonTypes";
import { passOrCreate } from "../../libs/drag/DragPointerEvent";
import classNames from "classnames";

export interface GameObjectViewProps {
    gameObject: GameObject;
    dragContainer: DragContainer;
    globalOffset: Vector2;
    globalScalar: double;
    onClick?: Consumer<GameObject>;
}

export interface GameObjectViewState {
    dragging: boolean;
}

export default class GameObjectView extends Component<GameObjectViewProps, GameObjectViewState> {

    constructor(props: GameObjectViewProps) {
        super(props);
        this.state = {
            dragging: false,
        };
    }

    readonly dragElement = new DragElement(
        passOrCreate(this.props.gameObject.getBehaviorByType<BehaviorDraggable>(BEHAVIOR_TYPE_CONTROLLER)), 
        {
            get: () => this.props.gameObject.position,
            set: (newPosition: Vector2) => {
                // const origin = this.props.gameObject.position;
                // console.log("origin", origin);
                // const delta = newPosition.sub(origin).div(square(this.props.globalScalar));
                // console.log("delta", delta);
                // this.props.gameObject.position = origin.add(delta);
                // console.log("position", this.props.gameObject.position );
                
                this.props.gameObject.position = newPosition;
            },
        },
        () => this.props.globalScalar,
    );

    onUiUpdate = () => {
        this.forceUpdate();
    };

    onDragStart = () => this.setState({ dragging: true });

    onDragEnd = () => this.setState({ dragging: false });

    onClick = () => {
        const gameObject = this.props.gameObject;
        const b = gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER);
        if (!b?.draggable) return;
        if (this.props.onClick) {
            this.props.onClick(this.props.gameObject);
        }
    };

    componentDidMount(): void {
        this.props.gameObject.onUiUpdate.add(this.onUiUpdate);
        this.dragElement.bindContainer(this.props.dragContainer);
        this.dragElement.listeners.onClick.add(this.onClick);
        this.dragElement.listeners.onDragStart.add(this.onDragStart);
        this.dragElement.listeners.onDragEnd.add(this.onDragEnd);
    }

    componentWillUnmount(): void {
        this.props.gameObject.onUiUpdate.remove(this.onUiUpdate);
        this.dragElement.unbindContainer();
        this.dragElement.listeners.onClick.remove(this.onClick);
        this.dragElement.listeners.onDragStart.remove(this.onDragStart);
        this.dragElement.listeners.onDragEnd.remove(this.onDragEnd);
    }
    
    render(): ReactNode {
        
        const gameObject = this.props.gameObject;

        const style: CSSProperties = {
            transform: `
                translate(-50%, -50%)
                rotate(${gameObject.rotation}rad) 
            `.trim(),
            background: `url("${gameObject.background}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            ...gameObject.position.toPositionCss(),
            ...gameObject.size.toSizeCss(),
        };
        // console.log(style);
        this.dragElement.enabled = gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER)?.draggable || false;

        return (
            <div 
                className={classNames(
                    "GameObjectView", 
                    this.state.dragging && "dragging",
                    gameObject.background && "with-background",
                    gameObject.shape && "shape-" + gameObject.shape,
                )}
                style={style}
                onMouseDown={createMouseListener(this.dragElement.onDown)}
                onMouseUp={createMouseListener(this.dragElement.onUp)}
                onWheel={this.onWheel}
            >
                
            </div>
        );
    }

    onWheel = (event: WheelEvent) => {
        const gameObject = this.props.gameObject;
        const b = gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER);
        if (!b?.draggable) return;
        event.stopPropagation();
        // event.preventDefault();

        const rotationSpeed = Math.pow(0.5, 6) * Math.PI;

        const sign = Math.sign(event.deltaY);
        const angle = gameObject.rotation + sign * rotationSpeed;
        if (angle >= 0) {
            gameObject.rotation = angle % (2 * Math.PI);
        } else {
            gameObject.rotation = (angle + (Math.abs(angle) / (2 * Math.PI) + 1)) * (2 * Math.PI) % (2 * Math.PI);
        }
        b?.onRotate.emit(gameObject.rotation);
    };
}