import { Component, ReactNode } from "react";
import Game from "../Game";
import Shop from "../model/Shop";

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
                {shop.items.map(item => (
                    <div className="item">
                        <div>
                            {item.type.name}, Price: {shop.pricreOf(item)}
                        </div>
                        <button onClick={() => shop.buy(item, game.profile)}>购买</button>
                    </div>
                ))}
            </div>
        );
    }
}