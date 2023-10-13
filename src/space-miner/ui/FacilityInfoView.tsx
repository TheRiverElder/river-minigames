import Facility from "../model/facility/Facility";
import SimpleInfoCardView from "./common/SimpleInfoCardView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./FacilityInfoView.scss";
import { Pair } from "../../libs/CommonTypes";
import Text from "../../libs/i18n/Text";

export interface FacilityInfoViewProps extends SpaceMinerUICommonProps {
    facility: Facility;
    readonly?: boolean;
    additionTools?: Array<Pair<Text, Function>>;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, resources, readonly, additionTools } = props;
    const isReadonly = !!readonly;
    return (
        <SimpleInfoCardView
            icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            name={(<span className="name">{facility.displayedName.process(i18n)}</span>)}
            description={(facility.renderStatus())}
            tools={!isReadonly && (
                <div className="FacilityInfoiew tools">
                    {[
                        ...(additionTools || []), 
                        ...facility.getTools(props),
                    ].map(([text, func], index) => (<button key={index} onClick={() => func()}>{text.process(i18n)}</button>))}
                </div>
            )}
        />
    );
}