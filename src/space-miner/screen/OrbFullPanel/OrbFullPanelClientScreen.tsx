import { ComponentType } from "react";
import GenericClientScreen, { createGenericClientScreenType } from "../../client/screen/GenericClientScreen";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import { OrbFullPanelView } from "./OrbFullPanelView";
import React from "react";
import { OrbModel } from "../../model/orb/Orb";
import { OrbFullPanelCommon, OrbFullPanelModel } from "./OrbFullPanelCommon";

export default class OrbFullPanelClientScreen extends GenericClientScreen<OrbFullPanelClientScreen> {
    
    public static readonly TYPE = createGenericClientScreenType(OrbFullPanelCommon.ID, OrbFullPanelClientScreen);

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

    override onUpdateClientUiData(data: OrbFullPanelModel): void {
        this.ref.current?.setState(data);
    }

}