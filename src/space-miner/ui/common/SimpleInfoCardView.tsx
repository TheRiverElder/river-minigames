import { MouseEventHandler, ReactNode } from "react";
import "./SimpleInfoCardView.scss";
import classNames from "classnames";

export interface SimpleInfoCardViewProps {
    className?: string;
    icon?: ReactNode;
    name?: ReactNode;
    description?: ReactNode;
    tools?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function SimpleInfoCardView(props: SimpleInfoCardViewProps): JSX.Element {
    const { icon, name, description, tools, onClick } = props;
    return (
        <div className={classNames("SimpleInfoCardView", props.className, onClick && "clickable")} onClick={onClick}>
            <div className="icon-wrapper">{icon}</div>
            <div className="detail">
                <div className="name-wrapper">{name}</div>
                <div className="description-wrapper">{description}</div>
            </div>
            {tools && (<div className="tools-wrapper">{tools}</div>)}
        </div>
    );
}