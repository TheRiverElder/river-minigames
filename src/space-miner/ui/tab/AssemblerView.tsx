import "./AssemblerView.scss";
import { Component, ReactNode } from "react";
import I18nText from "../../../libs/i18n/I18nText";
import { Nullable } from "../../../libs/lang/Optional";
import Recipe, { AssemblingContext } from "../../model/assemble/Recipe";
import Item from "../../model/item/Item";
import Inventory from "../../model/misc/storage/Inventory";
import { handleSomeItemAndUpdateUI } from "../common/Utils";
import SpaceMinerGameClientCommonProps, { purifyCommonProps } from "../common";
import ItemInfoView from "../common/model-view/ItemInfoView";
import Orb from "../../model/orb/Orb";


export interface AssemblerViewProps extends SpaceMinerGameClientCommonProps {
    // profile: Profile;
    orb: Orb;
}

export interface AssemblerViewState {
    recipe: Nullable<Recipe>;
    justSucceededAssembling: boolean;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    private assemblingContext: AssemblingContext = {
        game: this.props.game,
        materials: new Inventory(),
    };

    state: AssemblerViewState = {
        recipe: null,
        justSucceededAssembling: false,
    };

    override render(): ReactNode {

        const { i18n, game, orb, resources } = this.props;
        const { recipe } = this.state;

        const commonProps = purifyCommonProps(this.props);

        const productPreview = recipe?.previewProduct(this.assemblingContext);

        return (
            <div className="AssemblerView">
                <div className="left">
                    <div className="item-list">
                        {orb.supplimentNetwork.resources.content.map(item => (
                            <div className="bg-gradient light-gray">
                                <ItemInfoView {...commonProps} item={item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="middle">
                    <div className="product-preview">
                        {productPreview && (
                            <img src={productPreview.getImage(resources)} alt={productPreview.displayedName.process(i18n)} />
                        )}
                    </div>
                    <div className="recipe-selector">
                        <select
                            value={recipe?.name || ""}
                            onChange={e => this.setState({ recipe: game.recipes.get(e.target.value).orNull() })}
                        >
                            <option value="">请选择</option>
                            {game.recipes.values().map(recipe => (
                                <option key={recipe.name} value={recipe.name}>{recipe.displayedName.process(i18n)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="buttons">
                        <button 
                            className="bg-gradient dark-blue"
                            disabled={!this.canAssemble()}
                            onClick={this.assemble}
                        >
                            {i18n.get("ui.assembler.button.assemble")}
                        </button>
                        <button 
                            className="bg-gradient dark-gray"
                            onClick={this.clear}
                        >
                            {i18n.get("ui.assembler.button.clear")}
                        </button>
                    </div>
                    <div className="hints">
                        {this.getHintString()}
                    </div>
                </div>
                <div className="right">
                    {recipe ? (
                        <div className="item-list">
                            {recipe.previewMaterials(this.assemblingContext).map(material => (
                                <div className="bg-gradient light-gray">
                                    <ItemInfoView {...commonProps} item={material.item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>请选择配方</div>
                    )}
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

    // append(item: Item) {
    //     handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => {
    //         const tokenItem = this.preparingItems.removeExact(item);
    //         if (tokenItem.amount <= 0) return;
    //         this.assemblingContext.materials.add(tokenItem);
    //         this.setState({
    //             preparingItemList: this.preparingItems.content,
    //             justSucceededAssembling: false,
    //         });
    //     }, true);
    // }

    // unappend(item: Item) {
    //     handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => {
    //         const tokenItem = this.assemblingContext.materials.removeExact(item);
    //         if (tokenItem.amount <= 0) return;
    //         this.preparingItems.add(tokenItem);
    //         this.setState({
    //             preparingItemList: this.preparingItems.content,
    //             justSucceededAssembling: false,
    //         });
    //     }, true);
    // }

    readonly assemble = () => {
        const { orb } = this.props;
        const recipe = this.state.recipe;
        if (!recipe) return false;

        orb.assembler.addTask(recipe, this.assemblingContext.materials.content);

        this.setState({
            justSucceededAssembling: true,
        });
        this.assemblingContext = {
            game: this.props.game,
            materials: new Inventory(),
        };
        // game.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    };


    readonly clear = () => {
        this.setState({
            recipe: null,
        });
        this.props.orb.supplimentNetwork.resources.addAll(this.assemblingContext.materials.clear());
        this.assemblingContext = {
            game: this.props.game,
            materials: new Inventory(),
        };
    };
}