import "./ShopView.scss";
import { Component, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Item, { ItemType } from "../../model/item/Item";
import Shop from "../../model/Shop";
import NumberInputDialog from "../dialog/NumberInputDialog";
import { handleSomeItemAndUpdateUI } from "../common/Utils";
import SpaceMinerGameClientCommonProps, { DialogDetail, purifyCommonProps } from "../common";
import TaggedTabsPanel from "../common/TaggedTabsPanel";
import ItemInfoView from "../common/model-view/ItemInfoView";
import { Nullable } from "../../../libs/lang/Optional";

export type ShopAction = "idling" | "buying" | "selling";

export const SHOP_ACTION_IDLING: ShopAction = "idling";
export const SHOP_ACTION_BUYING: ShopAction = "buying";
export const SHOP_ACTION_SELLING: ShopAction = "selling";

export interface ShopViewProps extends SpaceMinerGameClientCommonProps {
    shop: Shop;
}

export interface ShopViewState {
    action: ShopAction;
}

export default class ShopView extends Component<ShopViewProps, ShopViewState> {

    constructor(props: ShopViewProps) {
        super(props);
        this.state = {
            action: SHOP_ACTION_IDLING,
        };
    }

    override render(): ReactNode {
        const { game, shop, i18n } = this.props;
        const profile = game.profile;

        const getTags = () => game.itemPersistor.registry.values();
        const itemHasTag = (item: Item, tag: ItemType) => item.type === tag;
        const renderTag = (tag: ItemType) => i18n.get(`item_type.${tag.id}.name`);

        const commonProps = purifyCommonProps(this.props);

        return (
            <div className="ShopView">
                <div className="content">
                    <div className="shop-items">
                        <TaggedTabsPanel
                            getTags={getTags}
                            getItems={() => shop.items}
                            itemHasTag={itemHasTag}
                            renderTag={renderTag}
                            renderItem={item => (
                                <ItemInfoView
                                    {...commonProps}
                                    item={item}
                                    tools={(
                                        <div className="tools">
                                            <div className="price">{shortenAsHumanReadable(shop.pricreOf(item))} Cd.</div>
                                            <div className="spacer" />
                                            <button onClick={() => this.onClickButtonBuy(item)}>{i18n.get(`ui.shop.button.buy`)}</button>
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className="customer-items">
                        <TaggedTabsPanel
                            getTags={getTags}
                            getItems={() => profile.warehouse.content}
                            itemHasTag={itemHasTag}
                            renderTag={renderTag}
                            renderItem={item => (
                                <ItemInfoView
                                    {...commonProps}
                                    item={item}
                                    tools={(
                                        <div className="tools">
                                            <div className="price">{shortenAsHumanReadable(shop.pricreOf(item))} Cd.</div>
                                            <div className="spacer" />
                                            <button onClick={() => this.onClickButtonSell(item)}>{i18n.get(`ui.shop.button.sell`)}</button>
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </div>
                </div>

                {shop.items.length === 0 && (
                    <div className="empty-hint">{this.props.i18n.get("ui.shop.text.empty_hint")}</div>
                )}
            </div>
        );
    }

    private buyingPack: Nullable<BuyingPack> = null;

    private onClickButtonBuy(item: Item) {
        if (item.amount === 1) {
            this.props.shop.buy(item, this.props.game.profile);
            this.forceUpdate();
            return;
        }

        this.setState({ action: SHOP_ACTION_BUYING });
        const dialogDetail = this.props.uiController.openDialogDetail({
            initialValue: item.amount,
            renderContent: (p) => NumberInputDialog({
                min: 0,
                max: item.amount,
                step: 1,
                value: p.value,
                onChange: p.onChange,
            }),
            confirmable: true,
            cancelable: true,
        });
        dialogDetail.promise.then(amount => {
            if (amount <= 0) return;
            this.props.shop.buy(item.copy(amount), this.props.game.profile);
        }).finally(() => this.resetToIdling());
        
        this.buyingPack = { item, dialogDetail };
    }

    resetToIdling() {
        this.buyingPack = null;
        this.setState({ action: SHOP_ACTION_IDLING });
    }

    private onClickButtonSell(item: Item) {
        handleSomeItemAndUpdateUI(item, this.props.uiController, () => this.forceUpdate(), (item) => this.props.shop.sell(item, this.props.game.profile), true);
    }

    onShopGoodsRemoved = (goods: Item) => {
        if (this.state.action === SHOP_ACTION_BUYING && this.buyingPack && goods.matches(this.buyingPack.item)) {
            this.buyingPack.dialogDetail.reject();
        }
    };

    componentDidMount(): void {
        this.props.shop.listeners.GOODS_REMOVED.add(this.onShopGoodsRemoved);
    }

    componentWillUnmount(): void {
        this.props.shop.listeners.GOODS_REMOVED.remove(this.onShopGoodsRemoved);
    }
}

interface BuyingPack {
    item: Item;
    dialogDetail: DialogDetail<number>;
}