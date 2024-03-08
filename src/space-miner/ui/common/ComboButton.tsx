import { Component, MouseEvent, PropsWithChildren, ReactNode } from "react";
import { int } from "../../../libs/CommonTypes";
import classNames from "classnames";
import "./ComboButton.scss";

export interface ComboButtonProps extends PropsWithChildren {
    resetTimeout?: number; // 多长时间不没有连击后重置连击计数器
    showCombo?: boolean;
}

export interface ComboButtonSatte {
    comboCounter: int;
}

export default class ComboButton extends Component<ComboButtonProps & JSX.IntrinsicElements["button"], ComboButtonSatte> {

    state = {
        comboCounter: 0,
    };

    override render(): ReactNode {
        return (
            <button
                {...this.props}
                className={classNames("ComboButton", { "combo": this.state.comboCounter >= 2 }, this.props.className)}
                onClick={this.onClick}
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