import { Component, PropsWithChildren, ReactNode } from "react";
import { NOP } from "../../../libs/lang/Constants";
import "./Overlay.scss";

export interface OverlayProps extends PropsWithChildren {
    onClickBackground?: Function;
}

export default class Overlay extends Component<OverlayProps> {
    render(): ReactNode {
        const { onClickBackground } = this.props;
        return (
            <div className="Overlay" onClick={() => (onClickBackground ?? NOP)()}>
                <div className="content" onClick={(event) => event.stopPropagation()}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}