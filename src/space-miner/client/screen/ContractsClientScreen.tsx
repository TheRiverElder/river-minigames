import { ComponentType } from "react";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import GenericClientScreen from "./GenericClientScreen";
import ContractsView from "../../ui/tab/ContractsView";
import React from "react";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { ClientScreenType } from "./ClientScreen";

export default class ContractsClientScreen extends GenericClientScreen<ContractsClientScreen> {
    
    public static readonly TYPE: ClientScreenType<ContractsClientScreen, void> =
        new CreativeType("contracts", (type, gameApi, data) => new ContractsClientScreen({ type, ...data }));

    private readonly ref = React.createRef<ContractsView>();

    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return () => (
            <ContractsView ref={this.ref} {...this.props} screen={this}/>
        );
    }
    
    onUpdateClientState(state?: any): void {
        this.ref.current?.setState({ contracts: state.contracts });
    }
}