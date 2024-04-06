import { double, int } from "../../../libs/CommonTypes";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { ContractModel } from "../../model/contract/Contract";
import { CreativeType } from "../../model/io/CreativeType";
import GenericClientScreen, { GenericClientScreenProps } from "./GenericClientScreen";
import { ClientScreenType } from "./ClientScreen";
import { ComponentType } from "react";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import ContractDraftView from "../../ui/tab/ContractDraftView";
import React from "react";

export default class ContractDraftClientScreen extends GenericClientScreen {

    public static readonly TYPE: ClientScreenType<ContractDraftClientScreen, { otherTraderUidList: Array<int> }> =
        new CreativeType("contract_draft", ({ type, game }, { uid, props, channel, payload }) => new ContractDraftClientScreen({ type, props, uid, channel }, payload.otherTraderUidList));

    constructor(
        props: GenericClientScreenProps,
        public readonly otherTraderUidList: Array<int>,
    ) {
        super(props);
    }

    private ref = React.createRef<ContractDraftView>();

    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return () => (
            <ContractDraftView 
                ref={this.ref}
                screen={this}
                {...this.props}
            />
        );
    }

    previewContract(): Promise<ContractModel> {
        return this.channel.request(ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT);
    }

    setOffer(traderUid: int, resourceTypeName: string, amount: double) {
        return this.channel.send(ScreenCommands.CONTRACT_DRAFT.SET_OFFER, [traderUid, resourceTypeName, amount]);
    }

    receive(command: string, data?: any): void {
        switch (command) {
            case ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT: {
                this.ref.current?.setState({ contract: data });
            } break;
        }
    }




}