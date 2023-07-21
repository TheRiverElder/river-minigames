import { Component, MouseEvent, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import ListenerManager from "../../libs/management/ListenerManager";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import Registry from "../../libs/management/Registry";
import Vector2 from "../../libs/math/Vector2";
import Marking from "../data/Marking";
import { MarkingEditor } from "./MarkingEditor";
import "./MarkingEditorView.scss";
import MarkingView from "./MarkingView";

export interface MarkingEditorViewProps {
    
}

export interface MarkingEditorViewState {
    markings: Array<Marking>
}

export default class MarkingEditorView extends Component<MarkingEditorViewProps, MarkingEditorViewState> implements MarkingEditor {

    constructor(props: MarkingEditorViewProps) {
        super(props);
        this.state = {
            markings: [],
        };
    }

    readonly markings = new ObservableRegistry<int, Marking>(it => it.uid);

    readonly listenerUp = new ListenerManager<Vector2>(); // 绝对位置
    readonly listenerMove = new ListenerManager<Vector2>(); // 与初始点的相对位置
    readonly listenerDown = new ListenerManager<Vector2>(); // 绝对位置

    render(): ReactNode {
        const { markings } = this.state;

        return (
            <div 
                className="MarkingEditorView"
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                <div className="markings">
                    {markings.map(marking => (
                        <MarkingView marking={marking} editor={this}/>
                    ))}
                </div>
            </div>
        );
    }

    componentDidMount(): void {
        this.markings.onAddListeners.add(() => this.setState({ markings: this.markings.values() }));
        this.markings.onRemoveListeners.add(() => this.setState({ markings: this.markings.values() }));

        this.markings.add(new Marking(1));
    }

    private startAbsolutePosition: Vector2 = Vector2.ZERO;

    onMouseDown = (event: MouseEvent) => {
        this.startAbsolutePosition = getPosition(event);
        this.listenerDown.emit(this.startAbsolutePosition);
    };

    onMouseMove = (event: MouseEvent) => {
        const currentAbsolutePosition = getPosition(event);
        const delta = currentAbsolutePosition.sub(this.startAbsolutePosition);
        this.listenerMove.emit(delta);
    };

    onMouseUp = (event: MouseEvent) => {
        const endAbsolutePosition = getPosition(event);
        this.listenerUp.emit(endAbsolutePosition);
    };
}

export function getPosition(event: MouseEvent) {
    return new Vector2(event.clientX, event.clientY);
}