import { CreativeType } from "../../model/io/CreativeType";
import GenericServerScreen from "./GenericServerScreen";
import { ServerScreenType } from "./ServerScreen";

export default class ContractListServerScreen extends GenericServerScreen<ContractListServerScreen> {

    public static readonly TYPE: ServerScreenType<ContractListServerScreen> =
        new CreativeType("contract_list", (type, runtime, { uid, profile, channel, payload }) => new ContractListServerScreen({ type, uid, runtime, profile , channel, payload }));




}