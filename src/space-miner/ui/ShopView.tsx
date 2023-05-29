import { Component, ReactNode } from "react";
import Game from "../Game";
import Item from "../model/item/Item";
import Shop from "../model/Shop";
import "./ShopView.scss";

export interface ShopViewProps {
    game: Game;
    shop: Shop;
}

export interface ShopViewState {
    
}

export default class ShopView extends Component<ShopViewProps> {
    override render(): ReactNode {
        const game = this.props.game;
        const shop = this.props.shop;

        return (
            <div className="ShopView">
                <h2 className="title">商店</h2>

                <div className="items">
                    {shop.items.map((item, index) => (
                        <div className="item" key={index}>
                            <div className="image-wrapper">
                                <img src={item.type.name} alt={item.type.name}/>
                            </div>
                            <div className="info">
                                <div className="name">{item.type.name.toUpperCase()}</div>
                                <div className="description">Blah blah blahblah blah!</div>
                            </div>
                            <div className="tail">
                                <div className="price">{shop.pricreOf(item)} Credits</div>
                                <div className="spacer"/>
                                <button onClick={() => this.onClickButtonBuy(item)}>购买</button>
                            </div>
                        </div>
                    ))}
                </div>

                {shop.items.length === 0 && (
                    <div className="empty-hint">
                        商店里没有东西卖了，稍后再来吧！
                    </div>
                )}
            </div>
        );
    }

    private onClickButtonBuy(item: Item) {
        this.props.shop.buy(item, this.props.game.profile);
        this.forceUpdate();
    }
}