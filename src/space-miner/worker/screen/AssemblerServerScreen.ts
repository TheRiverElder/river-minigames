import { int } from "../../../libs/CommonTypes";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import { AssemblingContextModel } from "../../model/assemble/Recipe";
import { CreativeType } from "../../model/io/CreativeType";
import Item, { ItemModel } from "../../model/item/Item";
import Orb from "../../model/orb/Orb";
import { ServerScreenType } from "./ServerScreen";
import GenericServerScreen, { GenericServerScreenProps } from "./GenericServerScreen";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { mapModel } from "../../../libs/io/Displayable";

export class AssemblerServerScreen extends GenericServerScreen<AssemblerServerScreen> {

    public static readonly TYPE: ServerScreenType<AssemblerServerScreen, { orbUid: int }> =
        new CreativeType("assembler", (type, runtime, { uid, profile, channel, payload }) => new AssemblerServerScreen({ type, uid, runtime, profile, channel, payload }));

    public readonly orbUid: int;

    constructor(
        props: GenericServerScreenProps<AssemblerServerScreen, {
            orbUid: int;
        }>,
    ) {
        super(props);
        this.orbUid = props.payload.orbUid;
    }

    override receive(command: string, data?: any): any {

        switch (command) {
            case ScreenCommands.ASSEMBLER.GET_ASSEMBLER_TASKS: {
                return this.orb.assembler.tasks.map(mapModel);
            }
            case ScreenCommands.ASSEMBLER.GET_RECIPE_RESULT: {
                const context = data as AssemblingContextModel;
                return this.orb.assembler.getRecipeResult(context, this.cachedItems);
            }
            case ScreenCommands.ASSEMBLER.ASSEMBLE: {
                const context = data as AssemblingContextModel;
                this.orb.assembler.assemble(context, this.cachedItems);
                this.updateClientUiData();
            } break;
            default: return super.receive(command, data);
        }
    }

    override collectClientUiData() {
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

        const g = new IncrementNumberGenerator(0);
        this.cachedItems = orb.supplimentNetwork.resources.content.map(it => ({ uid: g.generate(), item: it.copyWithAmount() }));
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