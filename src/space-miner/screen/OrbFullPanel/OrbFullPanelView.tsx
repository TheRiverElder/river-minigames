import React from "react";
import OrbFullPanelClientScreen from "./OrbFullPanelClientScreen";
import { OrbModel } from "../../model/orb/Orb";

export interface OrbFullPanelViewProps {
    ref: React.RefObject<OrbFullPanelView>;
    screen: OrbFullPanelClientScreen;
}

export interface OrbFullPanelViewState {
    orb: OrbModel;
}

export class OrbFullPanelView extends React.Component<OrbFullPanelViewProps, OrbFullPanelViewState> {
    
    render() {

        const orb = this.state.orb;

        return (
            <div className="OrbFullPanelView">
                {/* 左边一列折线图，表现最近的几种基础资源的产出情况 */}
                <div className="left">
                    <div className="resources">
                        {orb.supplimentNetwork.nonPersistableResources.map((resource, index) => (
                            <div className="resource" key={index}>
                                <div className="name">{resource.name}</div>
                                <div className="value">{resource.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 中间一列用列表的形式表现每个设施
                每个设施可以有一个按钮，点击后可以查看这个设施的详细信息
                每个设施的简易UI中可以有一个折线图表现最近的生产波动 */}
                <div className="middle">
                    <div className="facilities">
                        {orb.facilities.map((facility, index) => (
                            <div className="facility" key={index}>
                                <div className="name">{facility.name}</div>
                                <div className="value">{facility.active}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 右边一列用简易折线图，表现最近的几种资源的产出情况 */}
                <div className="right">
                    <div className="resources">
                        {orb.supplimentNetwork.resources.map((resource, index) => (
                            <div className="resource" key={index}>
                                <div className="name">{resource.name}</div>
                                <div className="value">{resource.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}