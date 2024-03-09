import { Component, MouseEvent, PropsWithChildren, ReactNode } from "react";
import { int } from "../../../libs/CommonTypes";
import classNames from "classnames";
import "./ComboButton.scss";

export interface ComboButtonProps extends PropsWithChildren {
    resetTimeout?: number; // 多长时间不没有连击后重置连击计数器
    pressTimeout?: number; // 长按时候，每隔多长时间点击一次，方便鼠标用户，默认为1000ms
    showCombo?: boolean;
}

export interface ComboButtonSatte {
    comboCounter: int;
    pressing: boolean;
}

export default class ComboButton extends Component<ComboButtonProps & JSX.IntrinsicElements["button"], ComboButtonSatte> {

    state: ComboButtonSatte = {
        comboCounter: 0,
        pressing: false,
    };

    private pidSet = new Set<NodeJS.Timeout>();

    override render(): ReactNode {
        if (this.state.pressing) {
            if (this.pidSet.size === 0) {
                const pid = setTimeout(() => {
                    const event = {} as MouseEvent<HTMLButtonElement>;
                    this.onClick(event);
                    this.pidSet.delete(pid);
                }, 2 * (this.props.pressTimeout ?? this.props.resetTimeout ?? 1000));
                this.pidSet.add(pid);
            }
        }

        return (
            <button
                {...this.props}
                className={classNames("ComboButton", { "combo": this.state.comboCounter >= 2 }, this.props.className)}
                onClick={this.onClick}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseLeave={this.onMouseLeave}
            >
                {(this.props.showCombo ?? true) && (
                    <div className="counter-wrapper">
                        <span key={this.state.comboCounter} className="counter">{this.state.comboCounter}</span>
                    </div>
                )}
                {this.props.children}
            </button>
        );
    }

    private readonly onMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
        this.props.onMouseDown && this.props.onMouseDown(event);
        this.setState(() => ({ pressing: true }));
    };

    private readonly onMouseUp = (event: MouseEvent<HTMLButtonElement>) => {
        this.props.onMouseUp && this.props.onMouseUp(event);
        this.cleanUpPressing();
    };

    private readonly onMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
        this.props.onMouseLeave && this.props.onMouseLeave(event);
        this.cleanUpPressing();
    };

    private cleanUpPressing() {
        this.setState(() => ({ pressing: false }));
        this.pidSet.forEach(it => clearTimeout(it));
        this.pidSet.clear();
    }

    private readonly onClick = (event: MouseEvent<HTMLButtonElement>) => {
        this.props.onClick && this.props.onClick(event);
        this.setState(s => ({ comboCounter: s.comboCounter + 1 }));
        this.refreshResetTimeout();
    };

    componentWillUnmount(): void {
        if (this.resetPid !== null) {
            clearTimeout(this.resetPid);
            this.resetPid = null;
        }
    }

    private resetPid: NodeJS.Timeout | null = null;

    private readonly refreshResetTimeout = () => {
        if (this.resetPid !== null) {
            clearTimeout(this.resetPid);
            this.resetPid = null;
        }
        this.resetPid = setTimeout(() => {
            this.setState({ comboCounter: 0 });
            this.resetPid = null;
        }, Math.max(0, this.props.resetTimeout ?? 1000));
    };
}