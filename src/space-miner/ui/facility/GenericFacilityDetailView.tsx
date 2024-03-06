import { CSSProperties, ReactNode } from "react";
import FacilityDetailView from "./FacilityDetailView";
import "./GenericFacilityDetailView.scss";
import { toPercentString } from "../../../libs/lang/Extensions";
import Text from "../../../libs/i18n/Text";
import { double } from "../../../libs/CommonTypes";

export default class GenericFacilityDetailView extends FacilityDetailView {

    override render(): ReactNode {
        const displayedPairs = this.props.facility.getDisplayedPairs();
        const displayedProgresses = this.props.facility.getDisplayedProgresses();
        return (
            <div className="GenericFacilityDetailView">
                <div className="display-pairs">
                    {displayedPairs.map(({ key, value, progress, style }, index) => (
                        <div className="pair" style={style} key={index}>
                            <div className="text">
                                <div className="key">{key.process(this.props.i18n)}</div>
                                <div className="value">{value.process(this.props.i18n)}</div>
                            </div>
                            {typeof progress === "number" && (
                                <div className="progress">
                                    <div className="border">
                                        <div className="bar" style={{ height: `${progress * 100}%` }}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="display-progresses">
                    {displayedProgresses.map(([keyText, progress], index) => (
                        <div className="row" key={index}>
                            <div className="key">{keyText.process(this.props.i18n)}</div>
                            <progress max={1} value={progress} />
                            <div className="value">{toPercentString(progress)}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export interface DisplayedPair {
    readonly key: Text;
    readonly value: Text;
    readonly progress?: double;
    readonly style?: CSSProperties;
}