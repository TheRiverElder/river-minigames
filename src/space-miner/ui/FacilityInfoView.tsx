import ConfigView from "../../libs/config/ConfigView";
import I18nText from "../../libs/i18n/I18nText";
import Facility from "../model/facility/Facility";
import SimpleInfoCardView from "./common/SimpleInfoCardView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface FacilityInfoViewProps extends SpaceMinerUICommonProps {
    facility: Facility;
}

export function FacilityInfoView(props: FacilityInfoViewProps): JSX.Element {
    const { facility, i18n, resources, client } = props;
    return (
        <SimpleInfoCardView
            icon={(<img src={resources.get(`facility:${facility.name}`)} alt={facility.name} />)}
            name={(<span className="name">{facility.displayedName.process(i18n)}</span>)}
            description={(facility.renderStatus())}
            tools={(
                <div className="tools">
                    <button
                        onClick={() => client.openTab({
                            title: new I18nText(`ui.config_view.text.title`, {
                                "name": facility.displayedName,
                            }),
                            content: (<ConfigView configurable={facility} i18n={i18n} />),
                        })}
                    >{i18n.get("ui.orb_info.button.config")}</button>
                </div>
            )}
        />
    );
}