import { Component, PropsWithChildren, ReactNode } from "react";
import { ifNotNull } from "../../libs/lang/Objects";
import "./Overlay.scss";

export interface OverlayProps extends PropsWithChildren {
    onBack?: Function;
}

export default class Overlay extends Component<OverlayProps> {
    render(): ReactNode {
        const { onBack } = this.props;
        return (
            <div className="Overlay">
                <div className="content">
                    {this.props.children}
                </div>
                {onBack && (<div className="back" onClick={() => ifNotNull(this.props.onBack || null, fn => fn())}>X</div>)}
            </div>
        );
    }
}