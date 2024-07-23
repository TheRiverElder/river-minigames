import { int } from "../../../libs/CommonTypes";
import Commands from "../../common/channel/Commands";
import { AssemblerModel } from "../../model/assemble/Assembler";
import { ContractModel } from "../../model/contract/Contract";
import { WorldModel } from "../../model/global/World";
import { LevelModel } from "../../model/level/Level";
import { OrbInfoModel, OrbModel } from "../../model/orb/Orb";
import ClientChannel from "./ClientChannel";

export default class GameQueryClientChannel extends ClientChannel {

    get name(): string {
        return "game_query";
    }

    requestOrb(orbUid: int): Promise<OrbModel> {
        return this.request(Commands.GAME_QUERY.COMMAND_ORB, orbUid);
    }

    requestOrbInfo(orbUid: int): Promise<OrbInfoModel> {
        return this.request(Commands.GAME_QUERY.COMMAND_ORB_INFO, orbUid);
    }

    requestAssembler(orbUid: int): Promise<AssemblerModel> {
        return this.request(Commands.GAME_QUERY.COMMAND_ASSEMBLER, orbUid);
    }

    requestConstructs(): Promise<Array<ContractModel>> {
        return this.request(Commands.GAME_QUERY.COMMAND_CONTRACTS);
    }

    requestLevel(): Promise<LevelModel> {
        return this.request(Commands.GAME_QUERY.COMMAND_LEVEL);
    }

    requestWorld(): Promise<WorldModel> {
        return this.request(Commands.GAME_QUERY.COMMAND_WORLD);
    }

}