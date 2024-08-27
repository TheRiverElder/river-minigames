import { ComponentType } from "react";
import GenericClientScreen from "../../client/screen/GenericClientScreen";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import { OrbFullPanelView } from "./OrbFullPanelView";
import React from "react";
import { OrbModel } from "../../model/orb/Orb";

export default class OrbFullPanelClientScreen extends GenericClientScreen<OrbFullPanelClientScreen> {

    private ref = React.createRef<OrbFullPanelView>();

    override getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return (props) => (
            <OrbFullPanelView
                {...this.props}
                {...props}
                ref={this.ref}
                screen={this}
            />
        );
    }

    override onUpdateClientUiData(data: OrbModel): void {
        // TODO 
    }

}