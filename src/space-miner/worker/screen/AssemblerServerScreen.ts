import { int } from "../../../libs/CommonTypes";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import { AssemblingContextModel } from "../../model/assemble/Recipe";
import Profile from "../../model/global/Profile";
import { CreativeType } from "../../model/io/CreativeType";
import Item, { ItemModel } from "../../model/item/Item";
import Orb from "../../model/orb/Orb";
import GenericServerScreen from "../../screen/GenericServerScreen";
import { ServerScreenType } from "../../screen/ServerScreen";
import { GameRuntime } from "../main";

export class AssemblerServerScreen extends GenericServerScreen {

    public static readonly COMMAND_RECIPE_RESULT = "recipe_result";
    public static readonly COMMAND_SCREEN_DATA = "screen_data";
    public static readonly COMMAND_ASSEMBLE = "assemble";

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
        const { command, data } = pack;

        switch (command) {
            case AssemblerServerScreen.COMMAND_RECIPE_RESULT: {
                const context = data as AssemblingContextModel;
                const responseData = this.orb.assembler.getRecipeResult(context, this.cachedItems);
                this.send({
                    command: AssemblerServerScreen.COMMAND_RECIPE_RESULT,
                    data: responseData,
                });
            } break;
            case AssemblerServerScreen.COMMAND_SCREEN_DATA: {
                this.sendScreenData();
            } break;
            case AssemblerServerScreen.COMMAND_ASSEMBLE: {
                const context = data as AssemblingContextModel;
                this.orb.assembler.assemble(context, this.cachedItems);
                this.sendScreenData();
            } break;
        }
    }

    sendScreenData() {
        this.send({
            command: AssemblerServerScreen.COMMAND_SCREEN_DATA,
            data: this.getDisplayedModel(),
        });
    }

    getDisplayedModel(): AssemblerServerScreenModel {
        return {
            cachedItems: this.cachedItems.map(it => ({
                uid: it.uid,
                item: it.item.getDisplayedModel(),
            })),
        };
    }

    override getOpenPayLoad() {
        return {
            orbUid: this.orbUid,
        };
    }

    get orb(): Orb {
        return this.runtime.game.world.orbs.getOrThrow(this.orbUid);
    }
    
    protected cachedItems: Array<CachedItem> = [];

    override setup(): void {
        const orb = this.orb;
        const assembler = orb.assembler;

        const g = new IncrementNumberGenerator(0);
        this.cachedItems = orb.supplimentNetwork.resources.content.map(it => ({ uid: g.generate(), item: it.copyWithAmount() }));

        this.sendScreenData();
    }

    override dispose() {
        this.cachedItems = [];
    }

}

export interface CachedItem {
    readonly uid: int;
    readonly item: Item;
}

export interface CachedItemModel {
    readonly uid: int;
    readonly item: ItemModel;
}

export interface AssemblerServerScreenModel {
    readonly cachedItems: Array<CachedItemModel>;
}