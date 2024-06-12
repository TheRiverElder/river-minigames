import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import GenericClientScreen, { GenericClientScreenProps } from "./GenericClientScreen";
import { ClientScreenType } from "./ClientScreen";
import { ComponentType } from "react";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import ContractDraftView from "../../ui/tab/ContractDraftView";
import React from "react";

export default class ContractDraftClientScreen extends GenericClientScreen<ContractDraftClientScreen> {

    public static readonly TYPE: ClientScreenType<ContractDraftClientScreen, void> =
        new CreativeType("contract_draft", (type, gameApi, data) => new ContractDraftClientScreen({ type, ...data }));

    // public readonly otherTraderUidList: Array<int>;


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

    // previewContract(): Promise<ContractModel> {
    //     return this.channel.request(ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT);
    // }

    // setOffer(traderUid: int, resourceTypeName: string, amount: double) {
    //     return this.channel.send(ScreenCommands.CONTRACT_DRAFT.SET_OFFER, [traderUid, resourceTypeName, amount]);
    // }

    // receive(command: string, data?: any): void {
    //     switch (command) {
    //         case ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT: {
    //             this.ref.current?.setState({ previewContract: data });
    //         } break;
    //     }
    // }
    
    // sendSetContractType(contractType: string) {
    //     return this.channel.send(ScreenCommands.CONTRACT_DRAFT.SET_CONTRACT_TYPE, contractType);
    // }
    
    // sendSetTrander(traderUid: int) {
    //     return this.channel.send(ScreenCommands.CONTRACT_DRAFT.SET_TRADER, traderUid);
    // }

    // requestGetTraders(): Promise<Array<TraderInfoModel>> {
    //     return this.channel.request(ScreenCommands.CONTRACT_DRAFT.GET_TRADERS);
    // }

    // requestGetSelfGoods(): Promise<Array<ItemModel>> {
    //     return this.channel.request(ScreenCommands.CONTRACT_DRAFT.GET_SELF_GOODS);
    // }

    // requestGetTraderGoods(traderUid: int): Promise<Array<ItemModel>> {
    //     return this.channel.request(ScreenCommands.CONTRACT_DRAFT.GET_TRADER_GOODS, traderUid);
    // }

    // sendSetOffers(traderUid: int, resourceTypeName: string, amount: int) {
    //     return this.channel.request(ScreenCommands.CONTRACT_DRAFT.GET_TRADER_GOODS, [traderUid, resourceTypeName, amount]);
    // }





}