import { Component, ReactNode } from "react";
import { FacilityInfoView } from "./FacilityInfoView";
import "./FacilityDetailView.scss";
import { Consumer, int, Pair } from "../../../../libs/CommonTypes";
// import ConfigView from "../../../../libs/config/ConfigView";
import I18nText from "../../../../libs/i18n/I18nText";
import { FacilityModel } from "../../../model/facility/Facility";
import { SpaceMinerGameClientCommonProps } from "../../common";
import { FacilityManager } from "../../tab/OrbFullPanel";
import Text from "../../../../libs/i18n/Text";

export interface FacilityDetailViewProps extends SpaceMinerGameClientCommonProps {
    facility: FacilityModel;
    index: int;
    manager: FacilityManager;
    onClickOperation?: Consumer<string>;
}

export interface FacilityDetailViewState {
    configuring: boolean;
}

export default class FacilityDetailView extends Component<FacilityDetailViewProps, FacilityDetailViewState> {

    state = {
        configuring: false,
    };

    override render(): ReactNode {
        // const { index, manager, facility, i18n } = this.props;

        const additionTools: Array<Pair<Text, Function>> = [[
            new I18nText(!this.state.configuring ? `ui.facility.button.open_config` : `ui.facility.button.close_config`),
            () => this.setState(s => ({ configuring: !s.configuring })),
        ]];


        // if (manager.canMove(index, -1)) {
        //     additionTools.push([
        //         new I18nText(`ui.facility.button.move_up`),
        //         () => this.props.manager.move(this.props.index, -1),
        //     ]);
        // }

        // if (manager.canMove(index, +1)) {
        //     additionTools.push([
        //         new I18nText(`ui.facility.button.move_down`),
        //         () => this.props.manager.move(this.props.index, +1),
        //     ]);
        // }

        return (
            <div className="FacilityDetailView">
                <FacilityInfoView
                    {...this.props}
                    additionTools={additionTools}
                />
                {/* {this.state.configuring && (<ConfigView key={this.configRefreshKey} configurable={facility} i18n={i18n} />)} */}
            </div>
        )
    }

    private configRefreshKey = 1;

    componentWillReceiveProps(nextProps: Readonly<FacilityDetailViewProps>, nextContext: any): void {
        if (nextProps.facility !== this.props.facility) {
            this.configRefreshKey++;
        }
    }
}