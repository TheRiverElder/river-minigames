import { CSSProperties } from "react";
import "./ScrollText.scss";
import classNames from "classnames";

export interface ScrollTextProps {
    text: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
}

export default function ScrollText(props: ScrollTextProps) {
    // Implement the scroll text functionality here
    const disabled = props.disabled ?? false;
    return (
        <div className={classNames("ScrollText", {disabled}, props.className)} style={props.style}>
            <div className="text">
                <div>{props.text}</div>
                <div>{props.text}</div>
            </div>
        </div>
    );
}