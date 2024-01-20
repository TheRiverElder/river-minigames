import "./AssemblerView.scss";
import { Component, ReactNode } from "react";
import I18nText from "../../../libs/i18n/I18nText";
import { Nullable } from "../../../libs/lang/Optional";
import Recipe, { AssemblingContext } from "../../model/assemble/Recipe";
import Item from "../../model/item/Item";
import Inventory from "../../model/misc/storage/Inventory";
import Profile from "../../model/Profile";
import { handleSomeItemAndUpdateUI } from "../common/Utils";
import SpaceMinerGameClientCommonProps, { purifyCommonProps } from "../common";
import ItemInfoView from "../common/model-view/ItemInfoView";


export interface AssemblerViewProps extends SpaceMinerGameClientCommonProps {
    profile: Profile;
}

export interface AssemblerViewState {
    preparingItemList: Array<Item>;
    justSucceededAssembling: boolean;
    recipe: Nullable<Recipe>;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    private preparingItems = new Inventory();

    private assemblingContext: AssemblingContext = {
        game: this.props.game,
        materials: new Inventory(),
    };

    constructor(props: AssemblerViewProps) {
        super(props);
        this.preparingItems.addAll(props.profile.warehouse.content.map(it => it.copyWithAmount()));
        this.state = {
            recipe: null, 
            preparingItemList: this.preparingItems.content,
            justSucceededAssembling: false,
        };
    }

    override render(): ReactNode {

        const { i18n, game } = this.props;
        const { recipe } = this.state;
        
        const commonProps = purifyCommonProps(this.props);

        return (
            <div className="AssemblerView">
                <div className="top-bar">
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

                <div className="workstation">
                    <div className="recipe-preview">
                        <div className="product panel">
                            <div className="title">
                                {i18n.get(`ui.assembler.title.product`)}
                            </div>
                            <div className="content">
                                {recipe && (<ItemInfoView {...commonProps} item={recipe.previewProduct(this.assemblingContext)} />)}
                            </div>
                        </div>

                        <div className="materials panel item-list">
                            <div className="title">
                                {i18n.get(`ui.assembler.title.materials`)}
                            </div>

                            <div className="content">
                                {recipe && recipe.previewMaterials(this.assemblingContext).map((material, index) =>
                                    <ItemInfoView {...commonProps} key={index} item={material.item}
                                        tools={!material.consumable && (
                                            <span className="not_consumable">{i18n.get("ui.assembler.text.consumable")}</span>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="preparing-area panel item-list">
                        <div className="title">
                            {i18n.get(`ui.assembler.title.preparing_area`)}
                        </div>
                        <div className="content">
                            {this.assemblingContext.materials.content.map((item, i) => (
                                <div key={i} className="item-wrapper">
                                    <ItemInfoView
                                    {...commonProps}
                                        item={item}
                                        tools={(
                                            <button onClick={() => this.unappend(item)}>{i18n.get("ui.assembler.button.unappend")}</button>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="inventory panel item-list">
                        <div className="title">
                            {i18n.get(`ui.assembler.title.inventory`)}
                        </div>
                        <div className="content">
                            {this.preparingItems.content.filter(item => recipe?.canAccept(item, this.assemblingContext)).map((item, i) => (
                                <div key={i} className="item-wrapper">
                                    <ItemInfoView
                                    {...commonProps}
                                        item={item}
                                        tools={(
                                            <button onClick={() => this.append(item)}>{i18n.get("ui.assembler.button.append")}</button>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
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

    append(item: Item) {
        handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => {
            const tokenItem = this.preparingItems.removeExact(item);
            if (tokenItem.amount <= 0) return;
            this.assemblingContext.materials.add(tokenItem);
            this.setState({
                preparingItemList: this.preparingItems.content,
                justSucceededAssembling: false,
            });
        }, true);
    }

    unappend(item: Item) {
        handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => {
            const tokenItem = this.assemblingContext.materials.removeExact(item);
            if (tokenItem.amount <= 0) return;
            this.preparingItems.add(tokenItem);
            this.setState({
                preparingItemList: this.preparingItems.content,
                justSucceededAssembling: false,
            });
        }, true);
    }

    assemble() {
        const { game, profile } = this.props;
        const recipe = this.state.recipe;
        if (!recipe) return false;

        if (!profile.warehouse.removeExactAll(this.assemblingContext.materials.content)) {
            game.displayMessage(new I18nText("ui.assembler.message.failed.no_enough_materials"));
            return;
        }

        const product = recipe.assemble(this.assemblingContext);
        profile.warehouse.add(product);

        this.assemblingContext.materials.cleanUp();
        profile.warehouse.addAll(this.assemblingContext.materials.clear());

        this.preparingItems.clear();
        this.preparingItems.addAll(profile.warehouse.content.map(it => it.copyWithAmount()));
        this.setState({
            preparingItemList: this.preparingItems.content,
            justSucceededAssembling: true,
        });
        game.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    }

}