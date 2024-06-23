import { int } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import { mapModel } from "../../../libs/io/Displayable";
import ScreenCommands from "../../common/screen/ScreenCommands";
import Contract from "../../model/contract/Contract";
// import Contract, { ContractDraftContext, ContractDraftContextParty } from "../../model/contract/Contract";
import SimpleContract from "../../model/contract/SimpleContract";
import { CreativeType } from "../../model/io/CreativeType";
import ResourceItem from "../../model/item/ResourceItem";
import { ResourceTypes } from "../../model/misc/ResourceTypes";
import GenericServerScreen, { GenericServerScreenProps } from "./GenericServerScreen";
import { ServerScreenType } from "./ServerScreen";

export default class ContractDraftServerScreen extends GenericServerScreen<ContractDraftServerScreen> {

    public static readonly TYPE: ServerScreenType<ContractDraftServerScreen> =
        new CreativeType("contract_draft", (type, runtime, { uid, profile, channel, payload }) => new ContractDraftServerScreen({ type, uid, runtime, profile, channel, payload }));

    // protected contractType: string = "";
    // readonly parties: Array<ContractDraftContextParty>;

    contractList: Array<Contract>;

    constructor(
        props: GenericServerScreenProps<ContractDraftServerScreen>,
    ) {
        super(props);

        this.contractList = [
            new SimpleContract(Date.now(), [
                new ResourceItem(this.runtime.game, ResourceTypes.IRON, 5),
            ], [
                new ResourceItem(this.runtime.game, ResourceTypes.MONEY, 5 * 5),
            ]),
            new SimpleContract(Date.now() + 1, [
                new ResourceItem(this.runtime.game, ResourceTypes.MONEY, 5 * 10),
            ], [
                new ResourceItem(this.runtime.game, ResourceTypes.IRON, 5),
            ]),
        ];

        // this.parties = [
        //     new ProfileTrader(this.profile),
        //     ...(props.payload.otherTraderUidList ?? []).map(it => this.runtime.game.traders.getOrThrow(it)),
        // ].map(it => ({ trader: it, offers: [] }));
    }

    // getOpenPayLoad() {
    //     return { otherTraderUidList: this.parties.map(it => it.trader.uid) };
    // }

    // reset() {
    //     this.parties.splice(0., this.parties.length, ...[new ProfileTrader(this.profile)].map(it => ({ trader: it, offers: [] })))
    // }

    // protected previewContract(): Contract {
    //     return new GenericContract(-1, this.parties.map(it => ({
    //         trader: it.trader,
    //         completed: false,
    //         offers: it.offers,
    //     })));
    // }

    // protected setOffer(traderUid: int, resourceTypeName: string, amount: double) {
    //     const party = this.parties.find(it => it.trader.uid === traderUid);
    //     if (!party) throw new Error("No such trader: " + traderUid);

    //     const resourceType = this.runtime.game.world.resourceTypes.getOrThrow(resourceTypeName);
    //     const item = new ResourceItem(this.runtime.game, resourceType, amount);

    //     const alreadyExistOne = party.offers.find(it => it.matches(item));
    //     if (alreadyExistOne) {
    //         alreadyExistOne.amount = item.amount;
    //     } else {
    //         party.offers.push(item);
    //     }

    //     party.offers = party.offers.filter(it => it.amount > 0);
    // }

    // makeContext(): ContractDraftContext {
    //     return {
    //         parties: this.parties.map(it => ({
    //             trader: it.trader,
    //             completed: false,
    //             offers: it.offers.slice(),
    //         })),
    //     };
    // }

    // getTraders(): Array<Trader> {
    //     if (this.contractType === "buy") return [this.runtime.game.traders.values()[0]];
    //     if (this.contractType === "sell") return [this.runtime.game.traders.values()[0]];
    //     return [];
    // }

    // response(command: string, data?: any) {
    //     switch (command) {
    //         case ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT: return this.previewContract().getDisplayedModel();
    //         case ScreenCommands.CONTRACT_DRAFT.GET_TRADERS: return this.getTraders().map(it => it.getDisplayedInfoModel());
    //         case ScreenCommands.CONTRACT_DRAFT.GET_SELF_GOODS: return this.parties.find(it => it.trader.uid === -1)?.trader.getGoods(this.makeContext());
    //         case ScreenCommands.CONTRACT_DRAFT.GET_TRADER_GOODS: return this.parties.find(it => it.trader.uid === (data as int))?.trader.getGoods(this.makeContext());
    //     }
    // }

    // receive(command: string, data?: any): void {
    //     switch (command) {
    //         case ScreenCommands.CONTRACT_DRAFT.SET_TRADER: {
    //             this.parties[1] = { trader: this.runtime.game.traders.getOrThrow(data as int), offers: [] };
    //             this.reset();
    //         } break;
    //         case ScreenCommands.CONTRACT_DRAFT.SET_OFFER: {
    //             this.setOffer(data[0], data[1], data[2]);
    //         } break;
    //         case ScreenCommands.CONTRACT_DRAFT.SET_CONTRACT_TYPE: {
    //             this.contractType = (data as string);
    //             this.reset();
    //         } break;
    //     }
    //     this.sendPreviewContract();
    // }

    override collectClientUiData() {
        return {
            contracts: this.contractList.map(mapModel),
        };
    }

    acceptContract(uid: int) {
        const contractIndex = this.contractList.findIndex(it => it.uid === uid);
        if (contractIndex < 0) return false;
        const contract = this.contractList[contractIndex];
        if (!contract) return false;

        this.contractList.splice(contractIndex, 1);
        this.profile.contracts.add(contract);
        this.runtime.game.displayMessage(new I18nText(`ui.${this.type.id}.contract_accepted`, { uid: contract.uid }));

        this.updateClientUiData();

        return true;
    }

    override receive(command: string, data?: any) {
        switch (command) {
            case ScreenCommands.CONTRACT_DRAFT.GET_CONTRACT_LIST: {
                return this.contractList.map(mapModel);
            }
            case ScreenCommands.CONTRACT_DRAFT.ACCEPT_CONTRACT: {
                return this.acceptContract(data as int);
            } 
            default: return super.receive(command, data);
        }
    }

    // sendPreviewContract() {
    //     this.channel.send(ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT, this.previewContract().getDisplayedModel());
    // }




}