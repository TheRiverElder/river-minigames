import { double, int } from "../../../libs/CommonTypes";
import ScreenCommands from "../../common/screen/ScreenCommands";
import Contract, { ContractDraftContextParty } from "../../model/contract/Contract";
import GenericContract from "../../model/contract/GenericContract";
import { CreativeType } from "../../model/io/CreativeType";
import ResourceItem from "../../model/item/ResourceItem";
import GenericServerScreen, { GenericServerScreenProps } from "./GenericServerScreen";
import { ServerScreenType } from "./ServerScreen";

export default class ContractDraftServerScreen extends GenericServerScreen {

    public static readonly TYPE: ServerScreenType<ContractDraftServerScreen, { otherTraderUidList: Array<int> }> =
        new CreativeType("contract_draft", ({ type, game }, { uid, profile, channel, payload }) => new ContractDraftServerScreen({ type, uid, runtime: game, profile, channel }, payload.otherTraderUidList));

    readonly parties: Array<ContractDraftContextParty>;

    constructor(
        props: GenericServerScreenProps,
        public readonly otherTraderUidList: Array<int>,
    ) {
        super(props);

        this.parties = [...otherTraderUidList, this.profile.uid].map(it => ({
            trader: this.runtime.game.traders.getOrThrow(it),
            offers: [],
        }));
    }

    getOpenPayLoad() {
        return { otherTraderUidList: this.otherTraderUidList };
    }

    protected previewContract(): Contract {
        return new GenericContract(-1, this.parties.map(it => ({
            trader: it.trader,
            completed: false,
            offers: it.offers,
        })));
    }

    protected setOffer(traderUid: int, resourceTypeName: string, amount: double) {
        const party = this.parties.find(it => it.trader.uid === traderUid);
        if (!party) throw new Error("No such trader: " + traderUid);

        const resourceType = this.runtime.game.world.resourceTypes.getOrThrow(resourceTypeName);
        const item = new ResourceItem(this.runtime.game, resourceType, amount);

        const alreadyExistOne = party.offers.find(it => it.matches(item));
        if (alreadyExistOne) {
            alreadyExistOne.amount = item.amount;
        } else {
            party.offers.push(item);
        }

        party.offers = party.offers.filter(it => it.amount > 0);
    }

    response(command: string, data?: any) {
        switch (command) {
            case ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT: {
                return this.previewContract().getDisplayedModel();
            }
        }
    }

    receive(command: string, data?: any): void {
        switch (command) {
            case ScreenCommands.CONTRACT_DRAFT.SET_OFFER: {
                this.setOffer(data[0], data[1], data[2]);
                this.channel.send(ScreenCommands.CONTRACT_DRAFT.PREVIEW_CONTRACT, this.previewContract().getDisplayedModel());
            } break;
        }
    }




}