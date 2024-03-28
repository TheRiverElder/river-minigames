import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import GenericClientScreen from "../../screen/GenericClientScreen";

export class AssemblerClientScreen extends GenericClientScreen {
    receive(pack: CommandPack<any>): void {
        throw new Error("Method not implemented.");
    }

}