import "./TextImageView.scss";

export interface TextImageViewProps {
    text: string;
    borderRadius?: number | string;
    backgroundColor?: string;
    color?: string;
    width?: number | string;
    height?: number | string;
}

export default function TextImageView(props: TextImageViewProps) {
    return (
        <div 
            className="TextImageView"
            style={{
                width: props.width,
                height: props.height,
                borderRadius: props.borderRadius,
                backgroundColor: props.backgroundColor,
                color: props.color,
            }}
        >
            <span>{props.text}</span>
        </div>
    );
}