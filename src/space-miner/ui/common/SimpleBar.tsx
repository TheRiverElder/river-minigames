import { double } from "../../../libs/CommonTypes";

export interface SimpleBarProps {
    height: string;
    color: string;
    ratio: double;
}

export default function SimpleBar(props: SimpleBarProps) {
    return (
        <div
            style={{
                width: `${props.ratio * 100}%`,
                height: props.height,
                background: props.color,
            }}
        />
    );
}