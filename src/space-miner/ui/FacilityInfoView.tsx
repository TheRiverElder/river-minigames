import Facility from "../model/facility/Facility";
import SimpleInfoCardView from "./common/SimpleInfoCardView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./FacilityInfoiew.scss";

export interface FacilityInfoViewProps extends SpaceMinerUICommonProps {
    facility: Facility;
    readonly?: boolean;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, resources, readonly } = props;
    const isReadonly = !!readonly;
    return (
        <SimpleInfoCardView
            icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            name={(<span className="name">{facility.displayedName.process(i18n)}</span>)}
            description={(facility.renderStatus())}
            tools={!isReadonly && (
                <div className="FacilityInfoiew tools">
                    {facility.getTools(props).map(([text, func], index) => (<button key={index} onClick={() => func()}>{text.process(i18n)}</button>))}
                </div>
            )}
        />
    );
}