import { Component, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import { createReactMouseListener } from "../../libs/drag/DragPointerEvent";
import Vector2 from "../../libs/math/Vector2";
import { GameWindow } from "../TableBottomSimulatorClient";
import "./GameWindowView.scss";

export interface GameWindowViewProps {
    window: GameWindow;
    dragConteiner: DragContainer;
}

export default class GameWindowView extends Component<GameWindowViewProps> {

    private readonly dragElement = new DragElement(this.props.dragConteiner, () => this.props.window.position);

    private readonly onUiUpdate = () => {
        this.forceUpdate();
    }

    private readonly onDragMove = (position: Vector2) => {
        this.props.window.position = position;
    };

    override componentDidMount(): void {
        this.dragElement.setup();
        this.dragElement.listeners.onDragMoveListeners.add(this.onDragMove);
        this.props.window.onUiUpdateListeners.add(this.onUiUpdate);
    }

    override componentWillUnmount(): void {
        this.dragElement.listeners.onDragMoveListeners.remove(this.onDragMove);
        this.props.window.onUiUpdateListeners.remove(this.onUiUpdate);
        this.dragElement.dispose();
    }

    override render(): ReactNode {
        const w = this.props.window;

        return (
            <div 
                className="GameWindowView"
                style={{
                    ...w.position.toPositionCss(),
                    ...w.size.toSizeCss(),
                }}
            >
                <div className="top-bar"
                    onMouseDown={createReactMouseListener(this.dragElement.onDown, true)}
                >{w.name}</div>
                <div className="content">
                    {w.renderContent()}
                </div>
            </div>
        );
    }
}