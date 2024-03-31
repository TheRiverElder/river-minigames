import "./AssemblerView.scss";
import { Component, ReactNode } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import { AssemblingContextModel, RecipeModel } from "../../model/assemble/Recipe";
import { ItemModel } from "../../model/item/Item";
import { SpaceMinerGameClientCommonProps, purifyCommonProps } from "../common";
import ItemInfoView from "../common/model-view/ItemInfoView";
import classNames from "classnames";
import NumberInputDialog from "../dialog/NumberInputDialog";
import { IsolatedFunction, Productor, double, int } from "../../../libs/CommonTypes";
import { AssemblerModel, CachedItemModel } from "../../model/assemble/Assembler";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";
import RegistryChannel from "../../client/channel/RegistryChannel";
import I18nText from "../../../libs/i18n/I18nText";


export interface AssemblerViewProps extends SpaceMinerGameClientCommonProps {
    // profile: Profile;
    orbUid: int;
}

export interface AssemblerViewState {
    assembler: Nullable<AssemblerModel>;
    recipes: Array<RecipeModel>;
    selectedRecipeName: Nullable<string>;
    recipeResult: Nullable<RecipeModel>;
    selectedMaterials: Array<CachedItemModel>;
    justSucceededAssembling: boolean;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    // private assemblingContext: AssemblingContext = {
    //     materials: new Inventory(),
    // };

    state: AssemblerViewState = {
        assembler: null,
        recipes: [],
        selectedRecipeName: null,
        recipeResult: null,
        selectedMaterials: [],
        justSucceededAssembling: false,
    };

    override render(): ReactNode {

        const { i18n } = this.props;
        const { assembler, recipes, selectedRecipeName, recipeResult, selectedMaterials } = this.state;

        if (!assembler) return;

        const commonProps = purifyCommonProps(this.props);

        const { tasks, cachedItems } = assembler;

        return (
            <div className="AssemblerView">
                {/* 左边 */}
                <div className="left panel">
                    {/* 仓库 */}
                    <div className="item-list">
                        {cachedItems.map((cachedItem) => (
                            <div key={cachedItem.uid} className="item bg-gradient light-gray clickable" onClick={() => this.append(cachedItem)} >
                                <ItemInfoView {...commonProps} item={cachedItem.item} />
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
                                {recipeResult && (
                                    <div className="item-list">
                                        {recipeResult.previewProducts.map((item, index) => (
                                            <div key={index} className="item bg-gradient dark-yellow" >
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
                                value={selectedRecipeName ?? ""}
                                onChange={e => {
                                    this.setState({ selectedRecipeName: e.target.value });
                                    this.refreshRecipeResult(true);
                                }}
                            >
                                <option value="">请选择</option>
                                {recipes.map(recipe => (
                                    <option key={recipe.name} value={recipe.name}>{restoreTextAndProcess(recipe.displayedName, i18n)}</option>
                                ))}
                            </select>
                        </div>
                        {/* 操作按钮 */}
                        <div className="buttons">
                            <button
                                className="bg-gradient dark-blue"
                                disabled={!(!!recipeResult?.canAssemble)}
                                onClick={this.assemble}
                            >
                                {i18n.get("ui.assembler.button.assemble")}
                            </button>
                            <button
                                className="bg-gradient dark-gray"
                                onClick={this.clearMaterials}
                            >
                                {i18n.get("ui.assembler.button.clear")}
                            </button>
                        </div>
                    </div>

                    {/* 中间底部 */}
                    <div className="bottom">
                        <div className="left panel">
                            {/* 原料需求 */}
                            {recipeResult ? (
                                <div className="item-list">
                                    {recipeResult.previewMaterials.map((material, index) => (
                                        <div key={index} className={classNames("item bg-gradient", true ? "dark-green" : "dark-red")}>
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
                                {selectedMaterials.map((material, index) => (
                                    <div key={index} className="item bg-gradient light-gray" onClick={() => this.setMaterialAmount(material)} >
                                        <ItemInfoView {...commonProps} item={material.item} />
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
                        {tasks.map((task, index) => (
                            <div key={index} className="item bg-gradient light-gray">
                                <div className="progress bg-gradient dark-green" style={{ width: `${task.progressTickCounter / 200 * 100}%` }}></div>
                                <ItemInfoView {...commonProps} item={task.products[0]} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    private disposeFunctions: IsolatedFunction[] = [];

    override componentDidMount(): void {
        const api = this.props.gameApi;
        this.disposeFunctions.push(api.channelGameUpdate.listeners.add(() => {
            api.channelGameQuery.requestAssembler(this.props.orbUid)
                .then(a => this.setState({ assembler: a }));
        }));
        api.channelGameAction.sendSignalOpenAssemblerUi(this.props.orbUid);
        api.channelRegistry.requestGetValuesOf<RecipeModel>(RegistryChannel.REGISTRY_RECIPE)
            .then(recipes => this.setState({ recipes }));
    }

    override componentWillUnmount(): void {
        this.clearMaterials();
        this.disposeFunctions.forEach(it => it());
        this.props.gameApi.channelGameAction.sendSignalOpenAssemblerUi(this.props.orbUid);
    }

    getHintString(): string {
        const i18n = this.props.i18n;
        if (this.state.justSucceededAssembling) return i18n.get("ui.assembler.hint.succeeded");
        const recipeResult = this.state.recipeResult;
        if (!recipeResult) return i18n.get("ui.assembler.hint.no_recipe_selected");
        
        return restoreTextAndProcess(recipeResult.hint, i18n);
    }

    append(cachedItem: CachedItemModel) {
        this.props.uiController.openDialog({
            initialValue: Math.round(cachedItem.item.amount),
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
            this.findAndAddMaterial(cachedItem.uid, amount, cachedItem.item);
            this.refreshRecipeResult(true);
        });
    }

    setMaterialAmount(cachedItem: CachedItemModel) {
        this.props.uiController.openDialog({
            initialValue: Math.round(cachedItem.item.amount),
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
            this.findAndAddMaterial(cachedItem.uid, () => amount, cachedItem.item);
            this.refreshRecipeResult(true);
        });
    }

    refreshRecipeResult(delay: boolean = false) {
        const act = () => {
            this.props.gameApi.channelGameQuery.requestRecipeResult(this.props.orbUid, this.makeContext())
                .then(recipeResult => this.setState({ recipeResult }));
        }
        if (delay) {
            setTimeout(act, 0);
        } else {
            act();
        }
    }

    makeContext(): AssemblingContextModel {
        if (!this.state.selectedRecipeName) throw null;
        return {
            recipe: this.state.selectedRecipeName,
            materials: this.state.selectedMaterials.map(it => ({
                cachedItemUid: it.uid,
                amount: it.item.amount,
            })),
        };
    }

    // setMaterialAmount(item: ItemModel) {
    //     this.props.uiController.openDialog({
    //         initialValue: Math.round(item.amount),
    //         renderContent: (p) => NumberInputDialog({
    //             min: 0,
    //             step: 1,
    //             value: p.value,
    //             onChange: p.onChange,
    //         }),
    //         confirmable: true,
    //         cancelable: true,
    //         blurable: true,
    //     }).then(amount => {
    //         item.amount = amount;
    //         this.assemblingContext.materials.cleanUp();
    //         this.forceUpdate();
    //     });
    // }

    readonly assemble = () => {
        const { gameApi } = this.props;

        gameApi.channelGameAction.sendSignalAssemble(this.props.orbUid, this.makeContext());

        this.setState({
            justSucceededAssembling: true,
        });

        this.refreshRecipeResult();

        this.props.uiController.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    };


    readonly clearMaterials = () => {
        this.setState({
            selectedMaterials: [],
        });
        // this.props.orb.supplimentNetwork.resources.addAll(this.assemblingContext.materials.clear());
        // this.assemblingContext = { materials: new Inventory() };
    };

    private findAndAddMaterial(uid: int, delta: double | Productor<double, double>, proto: ItemModel) {
        const mutate = typeof delta === 'number' ? ((n: double) => n + delta) : delta;
        const materials = this.state.selectedMaterials.slice();
        const index = materials.findIndex(it => it.uid === uid);
        if (index < 0) {
            const cache = {
                uid,
                item: { ...proto, amount: mutate(0) },
            };
            if (cache.item.amount > 0) {
                materials.push(cache);
            }
        } else {
            const cache = materials[index];
            const newAmount = mutate(cache.item.amount);
            if (newAmount <= 0) {
                materials.splice(index, 1);
            } else {
                materials.splice(index, 1, {
                    uid,
                    item: {
                        ...cache.item,
                        amount: newAmount,
                    },
                });
            }
        }

        this.setState(() => ({ selectedMaterials: materials }));
    }
}