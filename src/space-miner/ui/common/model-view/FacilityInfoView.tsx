
import { Pair } from "../../../../libs/CommonTypes";
import Text from "../../../../libs/i18n/Text";
import { restoreTextAndProcess } from "../../../../libs/i18n/TextRestorer";
import { FacilityModel } from "../../../model/facility/Facility";
import SpaceMinerGameClientCommonProps from "../../common";
import ComboButton from "../ComboButton";
import SimpleInfoCardView from "../SimpleInfoCardView";
import "./FacilityInfoView.scss";

export interface FacilityInfoViewProps extends SpaceMinerGameClientCommonProps {
    facility: FacilityModel;
    readonly?: boolean;
    additionTools?: Array<Pair<Text, Function>>;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, readonly, additionTools } = props;
    const isReadonly = !!readonly;

    return (
        <SimpleInfoCardView
            // icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            // icon={facility.renderIcon(props)}
            icon={restoreTextAndProcess(facility.displayedName, i18n)}
            name={(<span className="name">{restoreTextAndProcess(facility.displayedName, i18n)}</span>)}
            // description={(facility.renderStatus(props))}
            description={restoreTextAndProcess(facility.displayedName, i18n)}
            tools={!isReadonly && (
                <div className="FacilityInfoiew tool-panel">
                    <div className="facility-tools">
                        {/* {facility.getTools(props).map(([text, func], index) => (
                            <ComboButton    
                                key={index} 
                                className="bg-gradient dark-yellow"
                                resetTimeout={500}
                                onClick={() => func()} 
                            >{text.process(i18n)}</ComboButton>
                        ))} */}
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