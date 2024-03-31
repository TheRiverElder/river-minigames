import { int } from "../../../libs/CommonTypes";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import Profile from "../../model/global/Profile";
import { CreativeType } from "../../model/io/CreativeType";
import GenericServerScreen from "../../screen/GenericServerScreen";
import { ServerScreenType } from "../../screen/ServerScreen";
import { GameRuntime } from "../main";

export class AssemblerServerScreen extends GenericServerScreen {

    public static readonly TYPE: ServerScreenType<AssemblerServerScreen> =
        new CreativeType("assembler", ({ type, game }, { profile, payload }) => new AssemblerServerScreen(type, game, profile, payload.orbUid));

    constructor(
        type: ServerScreenType,
        runtime: GameRuntime,
        profile: Profile,
        public readonly orbUid: int,
    ) {
        super(type, runtime, profile);
    }

    override receive(pack: CommandPack<any>): void {
        console.log(this.type.id, pack);
    }

    override getOpenPayLoad() {
        return {
            orbUid: this.orbUid,
        };
    }

}