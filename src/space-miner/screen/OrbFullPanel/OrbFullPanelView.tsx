import React from "react";
import OrbFullPanelClientScreen from "./OrbFullPanelClientScreen";
import { OrbFullPanelModel } from "./OrbFullPanelCommon";
import "./OrbFullPanelView.scss";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../../ui/common";
import FacilityDetailView from "../../ui/common/model-view/FacilityDetailView";

export interface OrbFullPanelViewProps extends SpaceMinerGameClientCommonProps {
    ref: React.RefObject<OrbFullPanelView>;
    screen: OrbFullPanelClientScreen;
}

export interface OrbFullPanelViewState extends OrbFullPanelModel {

}

export class OrbFullPanelView extends React.Component<OrbFullPanelViewProps, OrbFullPanelViewState> {

    state: Readonly<OrbFullPanelViewState> = {
        orbInfo: {
            uid: 0,
            name: "",
            body: {
                radius: 0,
                color: 0,
                position: [0, 0],
                rotation: 0,
            },
            owner: null,
            maxFacilityAmount: 0,
        },
        otherItems: [],
        specialResources: [],
        resources: [],
        facilities: [],
    };

    render() {
        const { i18n, gameApi } = this.props;
        const {
            orbInfo,
            otherItems,
            specialResources,
            resources,
            facilities,
        } = this.state;

        const commonProps = purifyGameCommonProps(this.props);

        return (
            <div className="OrbFullPanelView">
                {/* 左边一列折线图，表现最近的几种基础资源的产出情况 */}
                <div className="left">
                    <div className="resources">
                        {specialResources.map(([resourceName, amount], index) => (
                            <div className="resource" key={index}>
                                <span className="name">{resourceName}</span>
                                <span className="value">{shortenAsHumanReadable(amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 中间一列用列表的形式表现每个设施
                每个设施可以有一个按钮，点击后可以查看这个设施的详细信息
                每个设施的简易UI中可以有一个折线图表现最近的生产波动 */}
                <div className="middle">
                    <div className="facilities">
                        {facilities.map((facility, index) => (
                            <div className="facility" key={index}>
                                {/* 显示每个Facility的UI */}
                                <FacilityDetailView 
                                    {...commonProps}
                                    facility={facility} 
                                    index={index}
                                    manager={this}
                                    onClickOperation={key => gameApi.channelGameAction.sendFacilityAcceptOperation(facility.location?.orb ?? 0, index, key)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 右边一列用简易折线图，表现最近的几种资源的产出情况 */}
                <div className="right">
                    <div className="resources">
                        {resources.map(([resourceName, amount], index) => (
                            <div className="resource" key={index}>
                                <span className="name">{resourceName}</span>
                                <span className="value">{shortenAsHumanReadable(amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}