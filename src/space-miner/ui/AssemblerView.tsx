import { Component, ReactNode } from "react";
import I18nText from "../../libs/i18n/I18nText";
import { removeFromArray } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Recipe, { AssemblingContext } from "../model/assemble/Recipe";
import Inventory from "../model/Inventory";
import Item from "../model/item/Item";
import Profile from "../model/Profile";
import "./AssemblerView.scss";
import ItemInfoView from "./ItemInfoView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface AssemblerViewProps extends SpaceMinerUICommonProps {
    profile: Profile;
}

export interface AssemblerViewState {
    // appendedItemList: Array<MinerPartItem>;
    preparingItemList: Array<Item>;
    justSucceededAssembling: boolean;
    recipe: Nullable<Recipe>;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    private assemblingContext: AssemblingContext = {
        materials: new Inventory(),
    };

    constructor(props: AssemblerViewProps) {
        super(props);
        this.state = {
            recipe: null,
            // appendedItemList: [],
            preparingItemList: props.profile.warehouse.content.slice(),
            justSucceededAssembling: false,
        };
    }
    
    override render(): ReactNode {

        const { i18n, game, client, resources } = this.props;
        const { preparingItemList, recipe } = this.state;

        return (
            <div className="AssemblerView">
                <div className="selector">
                    <div className="text">{i18n.get("ui.assembler.text.choose_recipe")}</div>
                    <select value={recipe?.name || ""} onChange={e => this.setState({ recipe: game.recipes.get(e.target.value).orNull() })}>
                        <option value="">---</option>
                        {game.recipes.values().map(recipe => (
                            <option key={recipe.name} value={recipe.name}>{recipe.displayedName.process(i18n)}</option>
                        ))}
                    </select>
                    <div className="hint">{this.getHintString()}</div>
                    <button disabled={!this.canAssemble()} onClick={() => this.assemble()}>{i18n.get("ui.assembler.button.assemble")}</button>
                </div>
                <div className="recipe-preview">
                    {recipe && (
                        <div className="product">
                            <ItemInfoView i18n={i18n} game={game} client={client} resources={resources} item={recipe.previewProduct(this.assemblingContext)}/>
                        </div>
                    )}
                    {recipe && (
                        <div className="materials">
                            {recipe.previewMaterials(this.assemblingContext).map((material, index) => 
                                <ItemInfoView key={index} i18n={i18n} game={game} client={client} resources={resources} item={material.item}
                                    tools={!material.consumable && (
                                        <span className="not_consumable">{i18n.get("ui.assembler.text.consumable")}</span>
                                    )}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="workstation">
                    <div className="left">
                        {this.assemblingContext.materials.content.map((item, i) => (
                            <div key={i} className="item-wrapper">
                                <ItemInfoView 
                                    item={item} 
                                    i18n={i18n} 
                                    client={client}
                                    resources={resources} 
                                    game={this.props.game}
                                    tools={(
                                        <button onClick={() => this.unappend(item)}>{i18n.get("ui.assembler.button.unappend")}</button>
                                    )} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="right">
                        {preparingItemList.filter(item => recipe?.canAccept(item, this.assemblingContext)).map((item, i) => (
                            <div key={i} className="item-wrapper">
                                <ItemInfoView 
                                    item={item} 
                                    i18n={i18n} 
                                    client={client}
                                    resources={resources} 
                                    game={this.props.game}
                                    tools={(
                                        <button onClick={() => this.append(item)}>{i18n.get("ui.assembler.button.append")}</button>
                                    )} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    getHintString(): string {
        const i18n = this.props.i18n;
        if (this.state.justSucceededAssembling) return i18n.get("ui.assembler.hint.succeeded");
        const recipe = this.state.recipe;
        if (!recipe) return i18n.get("ui.assembler.hint.no_recipe_selected");

        return recipe.getHint(this.assemblingContext).process(i18n);
    }

    canAssemble(): boolean {
        const recipe = this.state.recipe;
        if (!recipe) return false;
        return recipe.canAssemble(this.assemblingContext);
    }

    append(item: Item): boolean {
        const preparingItemList = this.state.preparingItemList.slice();
        if (!removeFromArray(preparingItemList, item)) return false;
    
        this.assemblingContext.materials.add(item);
        this.setState({
            preparingItemList: preparingItemList,
            justSucceededAssembling: false,
        });

        return true;
    }

    unappend(item: Item): boolean {
        const requiredAmount = item.amount;
        const removedItem = this.assemblingContext.materials.removeExact(item);
        if (removedItem.amount < requiredAmount) return false;
    
        const preparingItemList = this.state.preparingItemList.slice().concat(removedItem);
        this.setState({
            preparingItemList: preparingItemList,
            justSucceededAssembling: false,
        });

        return true;
    }

    assemble() {
        const { game, profile } = this.props;
        const recipe = this.state.recipe;
        if (!recipe) return false;

        const product = recipe.assemble(this.assemblingContext);

        if (profile.warehouse.removeExactAll(this.assemblingContext.materials.content)) {
            profile.warehouse.add(product);
            this.assemblingContext.materials.clear();
        }

        this.setState({ 
            preparingItemList: this.props.profile.warehouse.content.slice(), 
            justSucceededAssembling: true,
        });
        game.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    }

}