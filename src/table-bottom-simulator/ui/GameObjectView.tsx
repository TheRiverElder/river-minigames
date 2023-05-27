import { Component, CSSProperties, ReactNode, WheelEvent } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import "./GameObjectView.scss";
import { Consumer, double } from "../../libs/CommonTypes";
import classNames from "classnames";
import ControllerBehavior from "../builtin/behavior/ControllerBehavior";
import { createReactMouseListener } from "../../libs/drag/DragPointerEvent";
import CardBehavior from "../builtin/behavior/CardBehavior";

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
        this.dragElement = new DragElement(
            props.dragContainer, 
            () => this.props.gameObject.position,
            () => this.props.globalScalar,
        );
        this.state = {
            dragging: false,
        };
    }

    private readonly dragElement: DragElement;

    private ifHasControllerBehavior(handle: Consumer<ControllerBehavior>) {
        const behavior = this.props.gameObject.getBehaviorByType(ControllerBehavior.TYPE);
        if (behavior) {
            handle(behavior);
        }
    }

    private onUiUpdate = () => {
        this.forceUpdate();
    };

    private onDragStart = (v: Vector2) => {
        this.ifHasControllerBehavior(b => {
            if (!b.draggable) return;
            b.onDragStartListeners.emit(v);
            this.setState({ dragging: true });
        });
    };

    private onDragMove = (v: Vector2) => {
        this.ifHasControllerBehavior(b => {
            if (!b.draggable) return;
            // console.log("drag move", v, b.onDragMoveListeners)
            b.onDragMoveListeners.emit(v);
            this.setState({ dragging: true });
        });
    };

    private onDragEnd = (v: Vector2) => {
        this.ifHasControllerBehavior(b => {
            if (!b.draggable) return;
            b.onDragEndListeners.emit(v);
            this.setState({ dragging: false });
        });
    };

    private onClick = (v: Vector2) => {
        if (this.props.onClick) {
            this.props.onClick(this.props.gameObject);
        }
        this.ifHasControllerBehavior(b => {
            b.onClickListeners.emit(v);
            this.setState({ dragging: false });
        });
    };

    private onKeyDown(event: KeyboardEvent) {
        if (event.key.toLowerCase() === "f") {
            if (this.state.dragging) {
                const card = this.props.gameObject.getBehaviorByType(CardBehavior.TYPE);
                if (card) {
                    card.flipped = !card.flipped;
                    card.sendUpdate();
                }
            }
        }
    }

    override componentDidMount(): void {
        this.dragElement.setup();
        this.props.gameObject.onUiUpdateListeners.add(this.onUiUpdate);
        this.dragElement.listeners.onDragStartListeners.add(this.onDragStart);
        this.dragElement.listeners.onDragMoveListeners.add(this.onDragMove);
        this.dragElement.listeners.onDragEndListeners.add(this.onDragEnd);
        this.dragElement.listeners.onClickListeners.add(this.onClick);
        window.addEventListener("keydown", this.onKeyDown);
    }

    override componentWillUnmount(): void {
        this.dragElement.dispose();
        this.props.gameObject.onUiUpdateListeners.remove(this.onUiUpdate);
        this.dragElement.listeners.onDragStartListeners.remove(this.onDragStart);
        this.dragElement.listeners.onDragMoveListeners.remove(this.onDragMove);
        this.dragElement.listeners.onDragEndListeners.remove(this.onDragEnd);
        this.dragElement.listeners.onClickListeners.remove(this.onClick);
        window.addEventListener("keydown", this.onKeyDown);
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
                onMouseDown={createReactMouseListener(this.dragElement.onDown, true)}
                onMouseUp={createReactMouseListener(this.dragElement.onUp)}
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