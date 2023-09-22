import { ReactNode } from "react";
import "./SimpleInfoCardView.scss";

export interface SimpleInfoCardViewProps {
    icon?: ReactNode;
    name?: ReactNode;
    description?: ReactNode;
    tools?: ReactNode;
}

export default function SimpleInfoCardView(props: SimpleInfoCardViewProps): JSX.Element {
    const { icon, name, description, tools } = props;
    return (
        <div className="SimpleInfoCardView">
            <div className="icon-wrapper">{icon}</div>
            <div className="detail">
                <div className="name-wrapper">{name}</div>
                <div className="description-wrapper">{description}</div>
            </div>
            <div className="tools-wrapper">{tools}</div>
        </div>
    );
}