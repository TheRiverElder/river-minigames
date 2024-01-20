import { Component, PropsWithChildren, ReactNode } from "react";
import "./SectionView.scss";

export interface SectionViewProps extends PropsWithChildren {
    title: string;
}

export interface SectionViewState {
    collapsed: boolean;
}

export default class SectionView extends Component<SectionViewProps, SectionViewState> {
    constructor(props: SectionViewProps) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    override render(): ReactNode {
        const buttonChar = this.state.collapsed ? "▶" : "▼";
        return (
            <div className="SectionView">
                <div className="title-bar">
                    <span className="collapsed-sign" onClick={() => this.setState(s => ({ collapsed: !s.collapsed }))}>{buttonChar}</span>
                    <h2 className="title">{this.props.title}</h2>
                </div>
                {!this.state.collapsed && (<div className="content">{this.props.children}</div>)}
            </div>
        );
    }
}