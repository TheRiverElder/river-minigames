
import { Consumer, Pair } from "../../../../libs/CommonTypes";
import I18nText from "../../../../libs/i18n/I18nText";
import Text from "../../../../libs/i18n/Text";
import { restoreTextAndProcess } from "../../../../libs/i18n/TextRestorer";
import { NOP } from "../../../../libs/lang/Constants";
import { FacilityModel } from "../../../model/facility/Facility";
import SpaceMinerGameClientCommonProps from "../../common";
import GenericFacilityDetailView from "../../facility/GenericFacilityDetailView";
import ComboButton from "../ComboButton";
import SimpleInfoCardView from "../SimpleInfoCardView";
import "./FacilityInfoView.scss";

export interface FacilityInfoViewProps extends SpaceMinerGameClientCommonProps {
    facility: FacilityModel;
    readonly?: boolean;
    additionTools?: Array<Pair<Text, Function>>;
    onClickOperation?: Consumer<string>;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, readonly, additionTools, onClickOperation } = props;
    const isReadonly = !!readonly;

    return (
        <SimpleInfoCardView
            // icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            // icon={facility.renderIcon(props)}
            icon={restoreTextAndProcess(facility.displayedName, i18n)}
            name={(<span className="name">{restoreTextAndProcess(facility.displayedName, i18n)}</span>)}
            description={(<GenericFacilityDetailView {...props} facility={facility}/>)}
            tools={!isReadonly && (
                <div className="FacilityInfoiew tool-panel">
                    <div className="facility-tools">
                        {facility.acceptableOperationList.map(({ key, text }) => (
                            <ComboButton    
                                key={key} 
                                className="bg-gradient dark-yellow"
                                resetTimeout={500}
                                onClick={() => (onClickOperation ?? NOP)(key)} 
                            >{text ? restoreTextAndProcess(text, i18n) : new I18nText(`facility.common.operation.${key}`).process(i18n)}</ComboButton>
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