import "./AssemblerView.scss";
import { Component, ReactNode } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import { AssemblingContextItemModel, RecipeModel } from "../../model/assemble/Recipe";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import ItemInfoView from "../common/model-view/ItemInfoView";
import classNames from "classnames";
import NumberInputDialog from "../dialog/NumberInputDialog";
import { IsolatedFunction, double, int } from "../../../libs/CommonTypes";
import { AssemblerTaskModel } from "../../model/assemble/Assembler";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";
import I18nText from "../../../libs/i18n/I18nText";
import { CachedItemModel } from "../../worker/screen/AssemblerServerScreen";
import { AssemblerClientScreen } from "../../client/screen/AssemblerClientScreen";
import Commands from "../../common/channel/Commands";


export interface AssemblerViewProps extends SpaceMinerGameClientCommonProps {
    screen: AssemblerClientScreen;
    // profile: Profile;
    orbUid: int;
}

export interface AssemblerViewState {
    assemblerTasks: Array<AssemblerTaskModel>;
    recipes: Array<RecipeModel>;
    selectedRecipeName: Nullable<string>;
    selectedMaterials: Array<AssemblingContextItemModel>;
    justSucceededAssembling: boolean;
    recipeResult: Nullable<RecipeModel>;
    cachedItems: Array<CachedItemModel>;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    // private assemblingContext: AssemblingContext = {
    //     materials: new Inventory(),
    // };

    state: AssemblerViewState = {
        assemblerTasks: [],
        recipes: [],
        selectedRecipeName: null,
        selectedMaterials: [],
        justSucceededAssembling: false,
        recipeResult: null,
        cachedItems: [],
    };

    override render(): ReactNode {

        const { i18n } = this.props;
        const { assemblerTasks, recipes, selectedRecipeName, recipeResult, cachedItems } = this.state;

        const commonProps = purifyGameCommonProps(this.props);

        return (
            <div className="AssemblerView">
                {/* 左边 */}
                <div className="left panel">
                    {/* 仓库 */}
                    <div className="item-list">
                        {cachedItems.map((cachedItem) => (
                            <div key={cachedItem.uid} className="item bg-gradient light-gray clickable" onClick={() => this.setMaterial(cachedItem)} >
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
                                    this.props.screen.setRecipe(e.target.value);
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
                                className="bg-gradient dark-blue"
                                onClick={() => this.props.screen.autoFill()}
                            >
                                {i18n.get("ui.assembler.button.auto_fill")}
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
                                {this.getSelectedItemList().map((material, index) => (
                                    <div key={index} className="item bg-gradient light-gray" onClick={() => this.setMaterial(material)} >
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
                        {assemblerTasks.map((task, index) => (
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

    private getSelectedItemList(): Array<CachedItemModel> {
        const result: ReturnType<typeof this.getSelectedItemList> = [];
        for (const material of this.state.selectedMaterials) {
            const item = this.state.cachedItems.find(it => it.uid === material.cachedItemUid);
            if (item) {
                result.push({
                    uid: material.cachedItemUid,
                    item: {
                        ...item.item,
                        amount: material.amount,
                    },
                });
            }
        }
        return result;
    }

    private disposeFunctions: IsolatedFunction[] = [];

    override componentDidMount(): void {
        const api = this.props.gameApi;
        this.disposeFunctions.push(api.channelGameUpdate.listeners.UPDATE.add(() => {
            this.props.screen.fetchAssemblerTasks()
                .then(assemblerTasks => this.setState({ assemblerTasks }));
        }));
        // api.channelGameAction.sendSignalOpenAssemblerUi(this.props.orbUid);
        // api.channelRegistry.requestGetValuesOf<RecipeModel>(Commands.REGISTRY.REGISTRY_RECIPE)
        this.props.screen.fetchUnlockedRecipes()
            .then(recipes => this.setState({ recipes }));

        this.props.screen.updateUiData();
    }

    override componentWillUnmount(): void {
        this.clearMaterials();
        this.disposeFunctions.forEach(it => it());
        // this.props.gameApi.channelGameAction.sendSignalOpenAssemblerUi(this.props.orbUid);
    }

    getHintString(): string {
        const i18n = this.props.i18n;
        if (this.state.justSucceededAssembling) return i18n.get("ui.assembler.hint.succeeded");
        const recipeResult = this.state.recipeResult;
        if (!recipeResult) return i18n.get("ui.assembler.hint.no_recipe_selected");

        return restoreTextAndProcess(recipeResult.hint, i18n);
    }

    setMaterial(cachedItem: CachedItemModel) {
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
            this.findAndAddMaterial(cachedItem.uid, amount);
        });
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
        const { screen } = this.props;

        screen.assemble();

        this.setState({
            justSucceededAssembling: true,
        });

        this.props.uiController.displayMessage(new I18nText("ui.assembler.message.succeeded"));
    };


    readonly clearMaterials = () => {
        this.props.screen.clearMaterials();
    };

    private findAndAddMaterial(uid: int, delta: double) {
        this.props.screen.setMaterial({ cachedItemUid: uid, amount: delta });
    }
}