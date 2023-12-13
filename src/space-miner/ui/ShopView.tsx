import { Component, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import Item, { ItemType } from "../model/item/Item";
import Shop from "../model/Shop";
import NumberInputDialog from "./common/NumberInputDialog";
import { handleSomeItemAndUpdateUI } from "./common/Utils";
import ItemInfoView from "./ItemInfoView";
import "./ShopView.scss";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import TaggedTabsPanel from "./TaggedTabsPanel";

export interface ShopViewProps extends SpaceMinerUICommonProps {
    shop: Shop;
}

export interface ShopViewState {

}

export default class ShopView extends Component<ShopViewProps> {
    override render(): ReactNode {
        const { game, shop, i18n, client, resources } = this.props;
        const profile = game.profile;

        const getTags = () => game.itemPersistor.registry.values();
        const itemHasTag = (item: Item, tag: ItemType) => item.type === tag;
        const renderTag = (tag: ItemType) => i18n.get(`item_type.${tag.id}.name`);

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
                                    game={game}
                                    i18n={i18n}
                                    item={item}
                                    client={client}
                                    resources={resources}
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
                                    game={game}
                                    i18n={i18n}
                                    item={item}
                                    client={client}
                                    resources={resources}
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

    private onClickButtonBuy(item: Item) {
        if (item.amount === 1) {
            this.props.shop.buy(item, this.props.game.profile);
            this.forceUpdate();
            return;
        }
        this.props.client.openDialog({
            initialValue: item.amount,
            renderContent: (p) => NumberInputDialog({
                min: 0,
                max: item.amount,
                step: 1,
                value: p.value,
                onChange: p.onChange,
            }),
        }).then(amount => {
            if (amount <= 0) return;
            this.props.shop.buy(item.copy(amount), this.props.game.profile);
            this.forceUpdate();
        });
    }

    private onClickButtonSell(item: Item) {
        handleSomeItemAndUpdateUI(item, this.props.client, () => this.forceUpdate(), (item) => this.props.shop.sell(item, this.props.game.profile), true);
    }
}