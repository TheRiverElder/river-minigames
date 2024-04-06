import { CreativeType } from "../../model/io/CreativeType";
import GenericServerScreen from "./GenericServerScreen";
import { ServerScreenType } from "./ServerScreen";

export default class ContractListServerScreen extends GenericServerScreen {

    public static readonly TYPE: ServerScreenType<ContractListServerScreen> =
        new CreativeType("contract_list", ({ type, game }, { uid, profile, channel }) => new ContractListServerScreen({ type, uid, runtime: game, profile , channel }));




}