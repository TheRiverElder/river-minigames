import React, { ComponentType } from "react";
import GenericClientScreen, { createGenericClientScreenType } from "../../client/screen/GenericClientScreen";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import DevelopmentCenterView from "./DevelopmentCenterView";
import { DevelopmentCenterCommon, DevelopmentCenterModel } from "./DevelopmentCenterCommon";
import { int } from "../../../libs/CommonTypes";

export default class DevelopmentCenterClientScreen extends GenericClientScreen<DevelopmentCenterClientScreen> {

    public static readonly TYPE = createGenericClientScreenType(DevelopmentCenterCommon.ID, DevelopmentCenterClientScreen);

    private ref = React.createRef<DevelopmentCenterView>();
    
    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return (props) => (
            <DevelopmentCenterView
                {...this.props}
                {...props}
                ref={this.ref}
                screen={this}
            />
        );
    }

    override onUpdateClientUiData(data: DevelopmentCenterModel): void {
        this.ref.current?.setState(() => ({ ...data }));
    }


    unlock(name: string, level: int): Promise<void> {
        return this.channel.request(DevelopmentCenterCommon.Commands.UNLOCK, [name, level]);
    }
}