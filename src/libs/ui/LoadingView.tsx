import "./LoadingView.scss";

export interface LoadingViewProps {
    text?: string;
}

export default function LoadingView(props: LoadingViewProps) {
    return (
        <div className="LoadingView">
            <div className="text">{props.text || "载入中……"}</div>
            <div className="animation-area">
                <div className="animation-bar"></div>
                <div className="animation-bar"></div>
                <div className="animation-bar"></div>
            </div>
        </div>
    );
}