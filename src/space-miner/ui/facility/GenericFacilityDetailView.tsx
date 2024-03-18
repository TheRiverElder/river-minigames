import { ReactNode } from "react";
import FacilityDetailView from "./FacilityDetailView";
import "./GenericFacilityDetailView.scss";
import { toPercentString } from "../../../libs/lang/Extensions";
import classNames from "classnames";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";

export default class GenericFacilityDetailView extends FacilityDetailView {

    override render(): ReactNode {
        const { i18n, facility } = this.props;
        const { statusList } = facility;

        return (
            <div className="GenericFacilityDetailView">
                <div className="display-pairs">
                    {statusList.map(({ name, value, progress, width }, index) => (
                        <div
                            className={classNames(
                                "pair bg-gradient",
                                (typeof progress === "number") ? "dark-gray" : "light-gray",
                            )}
                            style={{
                                width: width ? width + "em" : "unset",
                            }}
                            key={index}
                        >
                            {typeof progress === "number" && (
                                <div className="progress bg-gradient dark-blue" style={{ width: `${toPercentString(progress, 2)}` }} />
                            )}
                            <div className="text">
                                <div className="name">{restoreTextAndProcess(name, i18n)}</div>
                                <div className="value">{restoreTextAndProcess(value, i18n)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className="display-progresses">
                    {displayedProgresses.map(([keyText, progress], index) => (
                        <div className="row" key={index}>
                            <div className="key">{keyText.process(this.props.i18n)}</div>
                            <progress max={1} value={progress} />
                            <div className="value">{toPercentString(progress)}</div>
                        </div>
                    ))}
                </div> */}
            </div>
        )
    }
}