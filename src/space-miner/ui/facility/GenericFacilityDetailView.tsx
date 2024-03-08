import { CSSProperties, ReactNode } from "react";
import FacilityDetailView from "./FacilityDetailView";
import "./GenericFacilityDetailView.scss";
import { toPercentString } from "../../../libs/lang/Extensions";
import Text from "../../../libs/i18n/Text";
import { double } from "../../../libs/CommonTypes";
import classNames from "classnames";

export default class GenericFacilityDetailView extends FacilityDetailView {

    override render(): ReactNode {
        const displayedPairs = this.props.facility.getDisplayedPairs();
        const displayedProgresses = this.props.facility.getDisplayedProgresses();

        return (
            <div className="GenericFacilityDetailView">
                <div className="display-pairs">
                    {displayedPairs.map(({ key, value, progress, style }, index) => (
                        <div
                            className={classNames(
                                "pair bg-gradient",
                                (typeof progress === "number") ? "dark-gray" : "light-gray",
                            )}
                            style={style}
                            key={index}
                        >
                            {typeof progress === "number" && (
                                <div className="progress bg-gradient dark-blue" style={{ width: `${toPercentString(progress, 2)}` }} />
                            )}
                            <div className="text">
                                <div className="key">{key.process(this.props.i18n)}</div>
                                <div className="value">{value.process(this.props.i18n)}</div>
                            </div>
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