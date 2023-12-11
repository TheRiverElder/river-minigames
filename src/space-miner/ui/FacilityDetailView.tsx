import { Component, ReactNode } from "react";
import ConfigView from "../../libs/config/ConfigView";
import Facility from "../model/facility/Facility";
import { FacilityInfoView } from "./FacilityInfoView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./FacilityDetailView.scss";
import I18nText from "../../libs/i18n/I18nText";
import { FacilityManager } from "./OrbFullPanel";
import { int, Pair } from "../../libs/CommonTypes";
import Text from "../../libs/i18n/Text";

export interface FacilityDetailViewProps extends SpaceMinerUICommonProps {
    facility: Facility;
    index: int;
    manager: FacilityManager;
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
        const { index, manager, facility, i18n } = this.props;

        const additionTools: Array<Pair<Text, Function>> = [[
            new I18nText(!this.state.configuring ? `ui.facility.button.open_config` : `ui.facility.button.close_config`),
            () => this.setState(s => ({ configuring: !s.configuring })),
        ]];


        if (manager.canMove(index, -1)) {
            additionTools.push([
                new I18nText(`ui.facility.button.move_up`),
                () => this.props.manager.move(this.props.index, -1),
            ]);
        }

        if (manager.canMove(index, +1)) {
            additionTools.push([
                new I18nText(`ui.facility.button.move_down`),
                () => this.props.manager.move(this.props.index, +1),
            ]);
        }

        return (
            <div className="FacilityDetailView">
                <FacilityInfoView
                    {...this.props}
                    additionTools={additionTools}
                />
                {this.state.configuring && (<ConfigView configurable={facility} i18n={i18n} />)}
            </div>
        )
    }
}