import classNames from "classnames";
import { Component, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import DragElement from "../../libs/drag/DragElement";
import { createReactMouseListener } from "../../libs/drag/DragPointerEvent";
import Vector2 from "../../libs/math/Vector2";
import "./GameWindowView.scss";
import { GameWindow } from "../simulator/TableBottomSimulatorClient";

export interface GameWindowViewProps {
    window: GameWindow;
    dragConteiner: DragContainer;
}

export interface GameWindowViewState {
    collapsed: boolean;
}

export default class GameWindowView extends Component<GameWindowViewProps, GameWindowViewState> {

    constructor(props: GameWindowViewProps) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

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
        const MyComponent = w.content as unknown as JSX.ElementType;

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
                >
                    <span>{w.name}</span>
                    <span onClick={() => this.setState(s => ({ collapsed: !s.collapsed }))}>{this.state.collapsed ? "-" : "▼"}</span>
                </div>
                <div className={classNames("content", { "collapsed": this.state.collapsed })}>
                    <MyComponent window={w}/>
                </div>
            </div>
        );
    }
}