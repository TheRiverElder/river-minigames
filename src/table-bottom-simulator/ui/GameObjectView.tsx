import { Component, CSSProperties, ReactNode, WheelEvent } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { createMouseListener } from "./TableBottomSimulatorView";
import BehaviorDraggable from "../builtin/behavior/ControllerBehavior";
import { Consumer, double } from "../../libs/CommonTypes";
import { passOrCreate } from "../../libs/drag/DragPointerEvent";
import classNames from "classnames";
import ControllerBehavior from "../builtin/behavior/ControllerBehavior";
import Behavior from "../gameobject/Behavior";

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

    private dragElement: DragElement = this.createDragElement();

    private createDragElement() {
        return new DragElement(
            passOrCreate(this.props.gameObject.getBehaviorByType<BehaviorDraggable>(ControllerBehavior.TYPE)), 
            {
                get: () => this.props.gameObject.position,
                set: (newPosition: Vector2) => this.props.gameObject.position = newPosition,
            },
            () => this.props.globalScalar,
        );
    }

    private destroyDragElement() {
        console.log("destroyDragElement");
        this.dragElement.unbindContainer();
        this.dragElement.listeners.onClickListeners.remove(this.onClick);
        this.dragElement.listeners.onDragStartListeners.remove(this.onDragStart);
        this.dragElement.listeners.onDragEndListeners.remove(this.onDragEnd);
    }

    private setupDragElement() {
        console.log("setupDragElement");
        this.dragElement = this.createDragElement();
        
        this.dragElement.bindContainer(this.props.dragContainer);
        this.dragElement.listeners.onClickListeners.add(this.onClick);
        this.dragElement.listeners.onDragStartListeners.add(this.onDragStart);
        this.dragElement.listeners.onDragEndListeners.add(this.onDragEnd);
    }

    private onUiUpdate = () => {
        this.forceUpdate();
    };

    private onDragStart = () => this.setState({ dragging: true });

    private onDragEnd = () => this.setState({ dragging: false });

    private onClick = () => {
        // const gameObject = this.props.gameObject;
        // const b = gameObject.getBehaviorByType(BEHAVIOR_TYPE_CONTROLLER);
        // if (!b?.draggable) return;
        if (this.props.onClick) {
            this.props.onClick(this.props.gameObject);
        }
    };

    private onBehaviorAdd = (behavior: Behavior) => {
        if (behavior.type === ControllerBehavior.TYPE && !(this.dragElement instanceof ControllerBehavior)) {
            this.setupDragElement();
        }
    };

    private onBehaviorRemove = (behavior: Behavior) => {
        if (behavior.type === ControllerBehavior.TYPE) {
            this.destroyDragElement();
            this.setupDragElement();
        }
    };

    override componentDidMount(): void {
        this.setupDragElement();
        this.props.gameObject.onUiUpdateListeners.add(this.onUiUpdate);
        this.props.gameObject.behaviors.onAddListeners.add(this.onBehaviorAdd);
        this.props.gameObject.behaviors.onRemoveListeners.add(this.onBehaviorRemove);
    }

    override componentWillUnmount(): void {
        this.destroyDragElement();
        this.props.gameObject.onUiUpdateListeners.remove(this.onUiUpdate);
        this.props.gameObject.behaviors.onAddListeners.remove(this.onBehaviorAdd);
        this.props.gameObject.behaviors.onRemoveListeners.remove(this.onBehaviorRemove);
    }
    
    override render(): ReactNode {
        
        const gameObject = this.props.gameObject;

        const backgroundStyle: CSSProperties = {};
        if (gameObject.background) {
            backgroundStyle.background = `url("${gameObject.background}") no-repeat center /100% 100%`;
        }

        const style: CSSProperties = {
            ...backgroundStyle,
            ...gameObject.position.toPositionCss(),
            ...gameObject.size.toSizeCss(),
            transform: `
                translate(-50%, -50%)
                rotate(${gameObject.rotation}rad) 
                scale(${this.state.dragging ? 1.2 : 1.0}) 
            `.trim(),
        };

        let controlled = false;
        const controllerBehavior = gameObject.getBehaviorByType(ControllerBehavior.TYPE);
        if (controllerBehavior) {
            const controller = controllerBehavior.controller;
            controlled = !!controller;
            style.borderColor = controller?.color;
        }

        // console.log(style);
        this.dragElement.enabled = gameObject.getBehaviorByType(ControllerBehavior.TYPE)?.draggable || false;

        return (
            <div 
                className={classNames(
                    "GameObjectView", 
                    gameObject.shape && "shape-" + gameObject.shape,
                    {
                        controlled,
                        dragging: this.state.dragging,
                        "with-background": !!gameObject.background,
                    },
                )}
                style={style}
                onMouseDown={createMouseListener(this.dragElement.onDown, true)}
                onMouseUp={createMouseListener(this.dragElement.onUp)}
                onWheel={this.onWheel}
            >
                
            </div>
        );
    }

    private onWheel = (event: WheelEvent) => {
        if (!this.state.dragging) return;
        event.stopPropagation();

        const gameObject = this.props.gameObject;
        const b = gameObject.getBehaviorByType(ControllerBehavior.TYPE);
        if (!b?.draggable) return;

        const rotationSpeed = Math.pow(0.5, 6) * Math.PI;

        const sign = Math.sign(event.deltaY);
        const angle = gameObject.rotation + sign * rotationSpeed;
        if (angle >= 0) {
            gameObject.rotation = angle % (2 * Math.PI);
        } else {
            gameObject.rotation = (angle + (Math.abs(angle) / (2 * Math.PI) + 1)) * (2 * Math.PI) % (2 * Math.PI);
        }
        b?.onRotateListeners.emit(gameObject.rotation);
    };
}