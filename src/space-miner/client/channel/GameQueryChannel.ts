import { int } from "../../../libs/CommonTypes";
import { AssemblerModel } from "../../model/assemble/Assembler";
import { AssemblingContextModel, RecipeModel } from "../../model/assemble/Recipe";
import { ContractModel } from "../../model/contract/Contract";
import { OrbModel } from "../../model/orb/Orb";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class GameQueryChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_ORB = "orb";
    public static readonly COMMAND_ASSEMBLER = "assembler";
    public static readonly COMMAND_RECIPE_RESULT = "recipe_result";
    public static readonly COMMAND_CONTRACTS = "contracts";

    get name(): string {
        return "game_query";
    }

    requestOrb(orbUid: int): Promise<OrbModel> {
        return this.request({ command: GameQueryChannel.COMMAND_ORB, data: orbUid });
    }

    requestAssembler(orbUid: int): Promise<AssemblerModel> {
        return this.request({ command: GameQueryChannel.COMMAND_ASSEMBLER, data: orbUid });
    }

    requestRecipeResult(orbUid: int, context: AssemblingContextModel): Promise<RecipeModel> {
        return this.request({ command: GameQueryChannel.COMMAND_RECIPE_RESULT, data: [orbUid, context] });
    }

    requestConstructs(): Promise<Array<ContractModel>> {
        return this.request({ command: GameQueryChannel.COMMAND_CONTRACTS });
    }

}