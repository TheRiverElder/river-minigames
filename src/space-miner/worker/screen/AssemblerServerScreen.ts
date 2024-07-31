import { double, int } from "../../../libs/CommonTypes";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import Recipe, { AssemblingContextItemModel, RecipeModel } from "../../model/assemble/Recipe";
import { CreativeType } from "../../model/io/CreativeType";
import Item, { ItemModel } from "../../model/item/Item";
import Orb from "../../model/orb/Orb";
import { ServerScreenType } from "./ServerScreen";
import GenericServerScreen, { GenericServerScreenProps } from "./GenericServerScreen";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { mapModel } from "../../../libs/io/Displayable";
import Optional, { Nullable } from "../../../libs/lang/Optional";
import Game from "../../model/global/Game";
import { filterNotEmpty } from "../../../libs/lang/Collections";
import { TechnologyModel } from "../../model/technology/Technology";

export class AssemblerServerScreen extends GenericServerScreen<AssemblerServerScreen> {

    public static readonly TYPE: ServerScreenType<AssemblerServerScreen, { orbUid: int }> =
        new CreativeType("assembler", (type, runtime, { uid, profile, channel, payload }) => new AssemblerServerScreen({ type, uid, runtime, profile, channel, payload }));

    public readonly orbUid: int;

    get game(): Game {
        return this.runtime.game;
    }

    constructor(
        props: GenericServerScreenProps<AssemblerServerScreen, {
            orbUid: int;
        }>,
    ) {
        super(props);
        this.orbUid = props.payload.orbUid;
    }

    private recipe: Nullable<Recipe> = null;
    private materials: Array<AssemblingContextItemModel> = [];

    override receive(command: string, data?: any): any {

        switch (command) {
            case ScreenCommands.ASSEMBLER.GET_ASSEMBLER_TASKS: {
                return this.orb.assembler.tasks.map(mapModel);
            }
            case ScreenCommands.ASSEMBLER.AUTO_FILL: {
                if (this.recipe) {
                    this.materials = this.orb.assembler.autoFill(this.recipe, this.cachedItems, this.materials);
                    this.updateClientUiData();
                }
            } break;
            case ScreenCommands.ASSEMBLER.SET_RECIPE: {
                const recipeName = data as string;
                this.recipe = this.game.recipes.get(recipeName).orNull();
                if (this.recipe) {
                    this.materials = this.orb.assembler.autoFill(this.recipe, this.cachedItems, this.materials);
                }
                this.updateClientUiData();
            } break;
            case ScreenCommands.ASSEMBLER.SET_MATERIAL: {
                const d = data as AssemblingContextItemModel;
                const index = this.materials.findIndex(it => it.cachedItemUid === d.cachedItemUid);
                if (index >= 0) {
                    this.materials.splice(index, 1, d);
                } else {
                    this.materials.push(d);
                }
                this.updateClientUiData();
            } break;
            case ScreenCommands.ASSEMBLER.CLEAR_MATERIALS: {
                this.materials = [];
                this.updateClientUiData();
            } break;
            case ScreenCommands.ASSEMBLER.ASSEMBLE: {
                const materials = this.getMaterialItems();
                if (this.recipe) {
                    this.orb.assembler.assemble(this.recipe, materials);
                    this.updateClientUiData();
                }
            } break;
            case ScreenCommands.ASSEMBLER.GET_UNLOCKED_RECIPES: {
                return this.getUnlockedRecipes();
            }
            default: return super.receive(command, data);
        }
    }

    private getMaterialItems(): Array<Item> {
        return filterNotEmpty(this.materials
            .map(({ cachedItemUid, amount }) => this.cachedItems.find(it => it.uid === cachedItemUid)?.item.copy(amount) ?? null)
        );
    }

    override collectClientUiData(): AssemblerServerScreenModel {
        return {
            cachedItems: this.cachedItems.map(it => ({
                uid: it.uid,
                item: it.item.getDisplayedModel(),
            })),
            recipe: this.recipe?.getDisplayedModel({ materials: this.getMaterialItems() }) ?? null,
            materials: this.materials,
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

    getUnlockedRecipes(): Array<RecipeModel> {
        return this.game.recipes.values()
            .filter(it => it.isUnlocked())
            .map(mapModel);
    }

    override setup(): void {
        const orb = this.orb;

        const g = new IncrementNumberGenerator(0);
        this.cachedItems = orb.supplimentNetwork.resources.content
            .map(it => ({ uid: g.generate(), item: it.copyWithAmount() }));
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
    readonly cachedItems?: Array<CachedItemModel>;
    readonly recipe?: Nullable<RecipeModel>;
    readonly materials?: Array<AssemblingContextItemModel>;
}