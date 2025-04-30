import { ReactNode } from "react";
import FacilityDetailView from "./FacilityDetailView";
import "./GenericFacilityDetailView.scss";
import { toPercentString } from "../../../libs/lang/Extensions";
import classNames from "classnames";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";
import { DisplayedStatus } from "../../model/facility/Facility";
import { TextModel } from "../../../libs/i18n/Text";
import I18n from "../../../libs/i18n/I18n";

export default class GenericFacilityDetailView extends FacilityDetailView {

    override render(): ReactNode {
        const { i18n, facility } = this.props;
        const { statusList } = facility;

        return (
            <div className="GenericFacilityDetailView">
                <div className="display-pairs">
                    {statusList.map((status, index) => this.renderStatus(status, index))}
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

    protected text(t: TextModel) {
        return restoreTextAndProcess(t, this.props.i18n);
    }

    renderStatus(status: DisplayedStatus, key: number): ReactNode {
        const { i18n } = this.props;
        switch (status.type) {
            case "classic": return (<ClassicStatus key={key} status={status} i18n={i18n} />);
            case "default":
            case undefined: return (<DefaultStatus key={key} status={status} i18n={i18n} />);
            default: return (<div key={key}>{this.text(status.name)} = {this.text(status.value)}</div>);
        }
    }
}


function DefaultStatus(props: { status: DisplayedStatus, i18n: I18n }) {
    const { progress, name, width, value } = props.status;
    const { i18n } = props;

    return (
        <div
            className={classNames(
                "pair default bg-gradient",
                (typeof progress === "number") ? "dark-gray" : "light-gray",
            )}
            style={{
                width: width ? width + "em" : "unset",
            }}
        >
            {typeof progress === "number" && (
                <div className="progress bg-gradient dark-blue" style={{ width: `${toPercentString(progress, 2)}` }} />
            )}
            <div className="text">
                <div className="name">{restoreTextAndProcess(name, i18n)}</div>
                <div className="value">{restoreTextAndProcess(value, i18n)}</div>
            </div>
        </div>
    );
}

function ClassicStatus(props: { status: DisplayedStatus, i18n: I18n }) {
    const { progress, name, width, value } = props.status;
    const { i18n } = props;

    return (
        <div
            className={classNames("pair classic bg-gradient")}
            style={{
                width: width ? width + "em" : "unset",
            }}
        >
            <span className="name">{restoreTextAndProcess(name, i18n)}</span>
            {(typeof progress === "number") ? (
                <div className="progress">
                    <div className="bar" style={{ width: `${toPercentString(progress, 2)}` }} />
                </div>
            ) : (":")}
            <span className="value">{restoreTextAndProcess(value, i18n)}</span>
        </div>
    );
}