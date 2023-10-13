import { Component, ReactNode } from "react";
import ConfigView from "../../libs/config/ConfigView";
import Facility from "../model/facility/Facility";
import { FacilityInfoView } from "./FacilityInfoView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./FacilityDetailView.scss";
import I18nText from "../../libs/i18n/I18nText";

export interface FacilityDetailViewProps extends SpaceMinerUICommonProps {
    facility: Facility;
}

export interface FacilityDetailViewState {
    configuring: boolean;
}

export default class FacilityDetailView extends Component<FacilityDetailViewProps, FacilityDetailViewState> {

    constructor(props: FacilityDetailViewProps) {
        super(props);
        this.state = {
            configuring: false,
        };
    }

    override render(): ReactNode {
        return (
            <div className="FacilityDetailView">
                <FacilityInfoView 
                    {...this.props}
                    additionTools={[
                        [
                            new I18nText(!this.state.configuring ? `ui.facility.button.open_config` :  `ui.facility.button.close_config`), 
                            () => this.setState(s => ({ configuring: !s.configuring })),
                        ],
                    ]} 
                />
                {this.state.configuring && (<ConfigView configurable={this.props.facility} i18n={this.props.i18n} />)}
            </div>
        )
    }
}