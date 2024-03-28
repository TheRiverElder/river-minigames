import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import GenericServerScreen from "../../screen/GenericServerScreen";

export class AssemblerServerScreen extends GenericServerScreen {
    receive(pack: CommandPack<any>): void {
        throw new Error("Method not implemented.");
    }

}