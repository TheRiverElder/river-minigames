import { int } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import { mapModel } from "../../../libs/io/Displayable";
import { CreativeType } from "../../model/io/CreativeType";
import GenericServerScreen from "./GenericServerScreen";
import { ServerScreenType } from "./ServerScreen";

export default class ContractsServerScreen extends GenericServerScreen<ContractsServerScreen> {

    public static readonly TYPE: ServerScreenType<ContractsServerScreen> =
        new CreativeType("contracts", (type, runtime, { uid, profile, channel, payload }) => new ContractsServerScreen({ type, uid, runtime, profile, channel, payload }));


    override response(command: string, data?: any) {
        if (command === "fulfill") {
            return this.fulfillContract(data as int);
        } else {
            return super.response(command, data);
        }
    }

    override collectClientUiData() {
        return {
            contracts: Array.from(this.profile.contracts).map(mapModel),
        };
    }

    fulfillContract(contractUid: int) {
        const contract = Array.from(this.profile.contracts).find(it => it.uid === contractUid);
        if (!contract) return;

        const terra = this.runtime.game.world.orbs.values().find(it => it.name.toLowerCase() === "terra");
        if (!terra) return;

        const consumedItems = terra.supplimentNetwork.resources.removeExactAll(contract.offering);
        if (consumedItems.length === 0) return;

        this.profile.contracts.delete(contract);
        terra.supplimentNetwork.resources.addAll(contract.receiving);
        this.runtime.game.displayMessage(new I18nText(`ui.${this.type.id}.contract_fulfilled`, { uid: contractUid }));

        this.updateClientUiData();

    }
}