import { Component, MouseEvent, ReactNode } from "react";
import Vector2 from "../../libs/math/Vector2";
import Marking from "../data/Marking";
import { MarkingEditor } from "./MarkingEditor";
import "./MarkingView.scss";

export interface MarkingViewProps {
    marking: Marking;
    editor: MarkingEditor;
}

export interface MarkingViewState {
    
}


export default class MarkingView extends Component<MarkingViewProps, MarkingViewState> {

    render(): ReactNode {
        const { marking } = this.props;

        return (
            <div
                className="MarkingView"
                style={{
                    ...marking.position.toPositionCss(),
                    ...marking.size.toSizeCss(),
                }}
                onMouseDown={this.onMouseDown}
            >
                
            </div>
        );
    }

    private startAbsolutePosition: Vector2 = Vector2.ZERO;

    onMouseDown = (event: MouseEvent) => {
        this.startAbsolutePosition = this.props.marking.position;
        this.props.editor.listenerMove.add(this.onContainerMove);
        this.props.editor.listenerUp.add(this.onContainerUp);
    };

    onContainerMove = (delta: Vector2) => {
        this.props.marking.position = this.startAbsolutePosition.add(delta);
        this.forceUpdate();
    };

    onContainerUp = () => {
        this.props.editor.listenerMove.remove(this.onContainerMove);
        this.props.editor.listenerUp.remove(this.onContainerUp);
    };
}