
import { Pair } from "../../../../libs/CommonTypes";
import Text from "../../../../libs/i18n/Text";
import Facility from "../../../model/facility/Facility";
import SpaceMinerGameClientCommonProps from "../../common";
import ComboButton from "../ComboButton";
import SimpleInfoCardView from "../SimpleInfoCardView";
import "./FacilityInfoView.scss";

export interface FacilityInfoViewProps extends SpaceMinerGameClientCommonProps {
    facility: Facility;
    readonly?: boolean;
    additionTools?: Array<Pair<Text, Function>>;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, readonly, additionTools } = props;
    const isReadonly = !!readonly;

    return (
        <SimpleInfoCardView
            // icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            icon={facility.renderIcon(props)}
            name={(<span className="name">{facility.displayedName.process(i18n)}</span>)}
            description={(facility.renderStatus(props))}
            tools={!isReadonly && (
                <div className="FacilityInfoiew tool-panel">
                    <div className="facility-tools">
                        {facility.getTools(props).map(([text, func], index) => (
                            <ComboButton key={index} onClick={() => func()} resetTimeout={500}>{text.process(i18n)}</ComboButton>
                        ))}
                    </div>
                    <div className="manager-tools">
                        {(additionTools || []).map(([text, func], index) => (
                            <button key={index} onClick={() => func()}>{text.process(i18n)}</button>
                        ))}
                    </div>
                </div>
            )}
        />
    );
}