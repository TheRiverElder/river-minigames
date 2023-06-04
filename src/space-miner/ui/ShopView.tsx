import { Component, ReactNode } from "react";
import Item from "../model/item/Item";
import Shop from "../model/Shop";
import "./ShopView.scss";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface ShopViewProps extends SpaceMinerUICommonProps {
    shop: Shop;
}

export interface ShopViewState {
    
}

export default class ShopView extends Component<ShopViewProps> {
    override render(): ReactNode {
        const shop = this.props.shop;
        const i18n = this.props.i18n;

        return (
            <div className="ShopView">
                <h2 className="title">{this.props.i18n.get("ui.shop.title")}</h2>

                <div className="items">
                    {shop.items.map((item, index) => (
                        <div className="item" key={index}>
                            <div className="image-wrapper">
                                <img src={item.image} alt={item.name.process(i18n)}/>
                            </div>
                            <div className="info">
                                <div className="name">{item.name.process(i18n)}</div>
                                <div className="description">{item.description.process(i18n)}</div>
                            </div>
                            <div className="tail">
                                <div className="price">{shop.pricreOf(item)} Cd.</div>
                                <div className="spacer"/>
                                <button onClick={() => this.onClickButtonBuy(item)}>购买</button>
                            </div>
                        </div>
                    ))}
                </div>

                {shop.items.length === 0 && (
                    <div className="empty-hint">{this.props.i18n.get("ui.shop.empty_hint")}</div>
                )}
            </div>
        );
    }

    private onClickButtonBuy(item: Item) {
        this.props.shop.buy(item, this.props.game.profile);
        this.forceUpdate();
    }
}