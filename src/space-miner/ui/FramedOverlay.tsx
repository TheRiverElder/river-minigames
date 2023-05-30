import { Component, PropsWithChildren, ReactNode } from "react";
import Overlay from "./Overlay";

export default class FramedOverlay extends Component<PropsWithChildren> {
    override render(): ReactNode {
        return (
            <Overlay>
                {this.props.children}
            </Overlay>
        );
    }
}