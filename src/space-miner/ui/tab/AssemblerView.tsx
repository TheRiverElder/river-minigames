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
import classNames from "classnames";
import NumberInputDialog from "../dialog/NumberInputDialog";


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

        const tasks = orb.assembler.tasks;
        const storage = orb.supplimentNetwork.resources.content.filter(it => recipe?.canAccept(it, this.assemblingContext) ?? true);
        const products = recipe?.previewProducts(this.assemblingContext);
        const materials = recipe?.previewMaterials(this.assemblingContext);

        return (
            <div className="AssemblerView">
                {/* 左边 */}
                <div className="left panel">
                    {/* 仓库 */}
                    <div className="item-list">
                        {storage.map(item => (
                            <div className="item bg-gradient light-gray clickable" onClick={() => this.append(item)} >
                                <ItemInfoView {...commonProps} item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 中间 */}
                <div className="middle">
                    {/* 中间顶部 */}
                    <div className="top">
                        <div className="left panel">
                            {/* 产物预览 */}
                            <div className="product-preview">
                                {products && (
                                    <div className="item-list">
                                        {products.map(item => (
                                            <div className="item bg-gradient dark-yellow" onClick={() => this.append(item)} >
                                                <ItemInfoView {...commonProps} item={item} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="right panel">
                            {/* 提示文本 */}
                            <div className="hints">
                                {this.getHintString()}
                            </div>
                        </div>
                    </div>

                    {/* 中间正中 */}
                    <div className="middle">
                        {/* 配方选择 */}
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
                        {/* 操作按钮 */}
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
                    </div>

                    {/* 中间底部 */}
                    <div className="bottom">
                        <div className="left panel">
                            {/* 原料需求 */}
                            {recipe ? (
                                <div className="item-list">
                                    {recipe.previewMaterials(this.assemblingContext).map(material => (
                                        <div className={classNames("item bg-gradient", true ? "dark-green" : "dark-red")}>
                                            <ItemInfoView {...commonProps} item={material.item} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>请选择配方</div>
                            )}
                        </div>
                        <div className="right panel">
                            {/* 原料预备 */}
                            <div className="item-list">
                                {this.assemblingContext.materials.content.map(material => (
                                    <div className="item bg-gradient light-gray" onClick={() => this.setMaterialAmount(material)} >
                                        <ItemInfoView {...commonProps} item={material} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右边 */}
                <div className="right panel">
                    {/* 任务列表 */}
                    <div className="task-list item-list">
                        {tasks.map(task => (
                            <div className="item bg-gradient light-gray">
                                <div className="progress bg-gradient dark-green" style={{ width: `${task.progressTickCounter / 200 * 100}%` }}></div>
                                <ItemInfoView {...commonProps} item={task.recipe.previewProducts(task.context)[0]} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    private dispose!: Function;

    override componentDidMount(): void {
        const listener = () => this.forceUpdate();
        this.props.game.listeners.POST_TICK.add(listener);
        this.dispose = () => this.props.game.listeners.POST_TICK.remove(listener);
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
        this.props.uiController.openDialog({
            initialValue: Math.round(item.amount),
            renderContent: (p) => NumberInputDialog({
                min: 0,
                step: 1,
                value: p.value,
                onChange: p.onChange,
            }),
            confirmable: true,
            cancelable: true,
            blurable: true,
        }).then(amount => {
            this.assemblingContext.materials.add(item.copy(amount));
            this.forceUpdate();
        });
    }

    unappend(item: Item) {
        handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => {
            const tokenItem = this.assemblingContext.materials.removeExact(item);
            if (tokenItem.amount <= 0) return;
            // this.props.orb.supplimentNetwork.resources.add(tokenItem);
            this.setState({
                justSucceededAssembling: false,
            });
            this.forceUpdate();
        }, true);
    }

    setMaterialAmount(item: Item) {
        this.props.uiController.openDialog({
            initialValue: Math.round(item.amount),
            renderContent: (p) => NumberInputDialog({
                min: 0,
                step: 1,
                value: p.value,
                onChange: p.onChange,
            }),
            confirmable: true,
            cancelable: true,
            blurable: true,
        }).then(amount => {
            item.amount = amount;
            this.assemblingContext.materials.cleanUp();
            this.forceUpdate();
        });
    }

    readonly assemble = () => {
        const { orb } = this.props;
        const recipe = this.state.recipe;
        if (!recipe) return false;

        orb.assembler.addTask(recipe, this.assemblingContext);
        const materials = this.assemblingContext.materials.content.map(it => it.copyWithAmount());
        this.assemblingContext = { materials: new Inventory() };
        this.assemblingContext.materials.addAll(materials);

        this.setState({
            justSucceededAssembling: true,
        });
        // game.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    };


    readonly clear = () => {
        this.setState({
            recipe: null,
        });
        // this.props.orb.supplimentNetwork.resources.addAll(this.assemblingContext.materials.clear());
        this.assemblingContext = { materials: new Inventory() };
    };

    componentWillUnmount(): void {
        this.clear();
        this.dispose();
    }
}